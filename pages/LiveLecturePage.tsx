
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateLectureScript, textToSpeech } from '../services/geminiService';
import { ICONS } from '../constants';

// Audio decoding functions from documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const MinimalVisualizer: React.FC<{ isTalking: boolean }> = ({ isTalking }) => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Outer rings */}
            <div className={`absolute w-full h-full rounded-full border-2 border-primary-light/30 dark:border-primary-dark/30 ${isTalking ? 'animate-wave-pulse' : ''}`} style={{ animationDelay: '0s' }}></div>
            <div className={`absolute w-full h-full rounded-full border-2 border-primary-light/20 dark:border-primary-dark/20 ${isTalking ? 'animate-wave-pulse' : ''}`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`absolute w-full h-full rounded-full border-2 border-primary-light/10 dark:border-primary-dark/10 ${isTalking ? 'animate-wave-pulse' : ''}`} style={{ animationDelay: '1s' }}></div>
            
            {/* Core Orb */}
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark shadow-xl transition-all duration-300 ${isTalking ? 'scale-110 animate-breathing-glow' : 'scale-100 opacity-80'}`}></div>
            
            {/* Inner Icon */}
            <div className="absolute text-white/90">
                {isTalking ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                    </svg>
                )}
            </div>
        </div>
    );
};

export const LiveLecturePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { subject, topic, duration } = location.state || {};

    const [script, setScript] = useState<string[]>([]);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [isTalking, setIsTalking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isReadyToStart, setIsReadyToStart] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    
    const bufferRef = useRef<{ [index: number]: AudioBuffer }>({});
    const scriptRef = useRef<string[]>([]);
    const fetchingRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        if (!subject || !topic) {
            navigate('/live-lecture-setup');
        } else {
            generateLectureScript(subject, topic, duration)
                .then(generatedScript => {
                    scriptRef.current = generatedScript;
                    setScript(generatedScript);
                    setIsLoading(false);
                    setIsReadyToStart(true); 
                })
                .catch(err => {
                    setError("Failed to generate the lecture script. Please try again.");
                    setIsLoading(false);
                });
        }
        
        return () => {
             audioContextRef.current?.close();
        }
    }, [subject, topic, duration, navigate]);

    const handleStartPlayback = () => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        setIsReadyToStart(false);
        setCurrentChunkIndex(0);
    }

    const handleEndSession = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        navigate('/live-lecture-setup');
    };

    const fetchAudioBuffer = async (index: number) => {
        if (index >= scriptRef.current.length || fetchingRef.current.has(index) || bufferRef.current[index]) return;
        
        fetchingRef.current.add(index);
        try {
            const audioData = await textToSpeech(scriptRef.current[index]);
            const decodedBytes = decode(audioData);
            const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current!, 24000, 1);
            bufferRef.current[index] = audioBuffer;
        } catch (err) {
            console.error(`Failed to fetch audio for index ${index}`, err);
        } finally {
            fetchingRef.current.delete(index);
        }
    };

    useEffect(() => {
        if (currentChunkIndex < 0 || currentChunkIndex >= scriptRef.current.length) {
            if (currentChunkIndex >= scriptRef.current.length && !isLoading) {
                setIsTalking(false);
            }
            return;
        }

        if (audioContextRef.current) {
             fetchAudioBuffer(currentChunkIndex + 1);
             fetchAudioBuffer(currentChunkIndex + 2);
        }

        const playCurrent = async () => {
            if (!audioContextRef.current) return;

            if (!bufferRef.current[currentChunkIndex]) {
                await fetchAudioBuffer(currentChunkIndex);
            }

            const buffer = bufferRef.current[currentChunkIndex];
            if (buffer && audioContextRef.current) {
                setIsTalking(true);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(gainNodeRef.current!);
                source.start();
                
                source.onended = () => {
                    setCurrentChunkIndex(prev => prev + 1);
                };
            } else {
                console.warn("Skipping chunk due to missing audio buffer");
                setCurrentChunkIndex(prev => prev + 1);
            }
        };

        playCurrent();

    }, [currentChunkIndex, isLoading]);

    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-primary-light/5 dark:to-primary-dark/10"></div>

            <div className="relative z-10 w-full max-w-3xl p-8 flex flex-col items-center">
                {isLoading && (
                    <div className="flex flex-col items-center bg-white/80 dark:bg-black/50 backdrop-blur-md p-8 rounded-3xl shadow-xl">
                        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent dark:border-primary-dark dark:border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-lg font-semibold animate-pulse-soft">Preparing lecture content...</p>
                    </div>
                )}
                
                {error && <div className="text-danger font-bold p-4 bg-danger/10 rounded-lg">{error}</div>}
                
                {!isLoading && !error && isReadyToStart && (
                     <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg p-10 rounded-[2rem] shadow-2xl flex flex-col items-center animate-pop-in border border-white/20">
                        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary-light to-secondary-light text-transparent bg-clip-text">{topic}</h1>
                        <p className="text-lg text-subtle-dark dark:text-subtle-light mb-8">Ready for your session?</p>
                        <button 
                            onClick={handleStartPlayback}
                            className="px-10 py-4 bg-gradient-to-r from-primary-light to-secondary-light text-white text-xl font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            {React.cloneElement(ICONS.presentationChart, {className: 'w-6 h-6'})}
                            Start Lecture
                        </button>
                     </div>
                )}

                {!isLoading && !error && !isReadyToStart && (
                    <>
                        <div className="mb-12 transform scale-110 transition-transform duration-500">
                            <MinimalVisualizer isTalking={isTalking} />
                        </div>

                        <div className="w-full min-h-[16rem] p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 dark:border-white/5 transition-all duration-500 flex flex-col items-center justify-center text-center">
                           {currentChunkIndex < script.length ? (
                               <>
                                   <h3 className="text-xs font-bold text-primary-light dark:text-primary-dark uppercase tracking-widest mb-6 opacity-80">Live Transcript</h3>
                                   <p className="text-2xl md:text-3xl leading-relaxed font-semibold transition-opacity duration-300 animate-fade-in text-slate-800 dark:text-slate-100 tracking-tight">
                                        {script[currentChunkIndex]}
                                   </p>
                               </>
                           ) : (
                               <div className="animate-pop-in">
                                   <h2 className="text-3xl font-bold mb-2">Lecture Complete!</h2>
                                   <p className="text-subtle-dark dark:text-subtle-light">Great job listening. Review your notes or take a quiz!</p>
                               </div>
                           )}
                        </div>
                        
                        <div className="mt-8 flex gap-4">
                            {currentChunkIndex >= script.length ? (
                                 <button onClick={() => navigate('/live-lecture-setup')} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-full font-bold shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                                    New Topic
                                 </button>
                            ) : (
                                <button onClick={handleEndSession} className="px-8 py-3 bg-danger/10 text-danger hover:bg-danger/20 rounded-full font-bold transition-colors">
                                    End Session
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};