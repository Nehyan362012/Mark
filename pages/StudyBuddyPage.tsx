
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    role: 'user' | 'model';
    text: string;
    image?: string;
}

export const StudyBuddyPage: React.FC = () => {
    const { user } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;
    const location = useLocation();
    
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasInitialized = useRef(false);

    const isTeacher = user?.role === 'teacher';

    // Initialize chat session
    useEffect(() => {
        const initChat = () => {
            const isUrdu = user?.studyLanguage === 'Urdu';
            
            let systemInstruction = "";

            if (isTeacher) {
                systemInstruction = `You are a professional, efficient, and knowledgeable AI Teaching Assistant. Your goal is to support a teacher with lesson planning, grading rubrics, creative activity ideas, administrative advice, and student engagement strategies.
                
                **Directives:**
                1. **Professional Tone:** Be concise, organized, and practical.
                2. **Curriculum Focus:** When discussing topics, align with standard educational frameworks or the teacher's specified subject (${user?.teachingSubject || 'General'}).
                3. **Resource Generation:** Be ready to draft emails to parents, quiz questions, or project outlines immediately.
                4. **Formatting:** Use markdown lists, bold headers, and clear structure to make your outputs easy to skim and copy.
                5. **Persona:** You are a supportive colleague. Introduce yourself as the "AI Assistant".
                `;
            } else {
                systemInstruction = `You are Marky, an enthusiastic and witty AI study buddy for a ${user?.grade || 'student'}. Your personality is encouraging, a bit playful, but always focused on helping the student achieve 'aha!' moments.

                **Core Directives:**
                1.  **Language:** ${isUrdu ? "You MUST reply in Urdu (Urdu script). Use Roman Urdu only if specifically asked." : "Use simple, clear English suitable for a Pakistani student audience."}
                2.  **NEVER Give Direct Answers:** Your primary role is to be a guide, not an answer key. Use the Socratic method. Ask leading questions to help the student think critically and arrive at the solution themselves.
                3.  **Structured & Clear Explanations:** When explaining a concept, use markdown extensively. Use **bold** for key terms, bullet points for lists, and \`inline code\` for formulas or technical terms. Break complex topics into small, digestible chunks.
                4.  **Use Analogies:** Make learning sticky by using relatable analogies and real-world examples appropriate for the student's grade level.
                5.  **Check for Understanding:** After an explanation, always ask a simple, targeted question to see if they've grasped the concept. For example, "So, in your own words, why is the mitochondria so important?"
                6.  **Maintain Persona:** Be positive and use encouraging phrases. Start the conversation by introducing yourself as Marky and asking what amazing topic is on the agenda for today.
                7.  **Image Analysis:** If the user uploads an image, acknowledge it and ask how you can help with it.`;
            }
            
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setChat(newChat);
        };
        if (user) {
            initChat();
        }
    }, [user, isTeacher]);

    const handleSendMessage = useCallback(async (prompt?: string) => {
        const textToSend = prompt || input;
        if ((!textToSend.trim() && !uploadedImage) || isLoading || !chat) return;

        playSound('swoosh');
        
        const userMessage: Message = { 
            role: 'user', 
            text: textToSend,
            image: uploadedImage ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}` : undefined,
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        // Store image locally to send, then clear state
        const imagePart = uploadedImage ? { inlineData: { data: uploadedImage.data, mimeType: uploadedImage.mimeType } } : null;
        setUploadedImage(null);
        
        setIsLoading(true);
        
        const parts: Part[] = [];
        if (imagePart) parts.push(imagePart);
        if (textToSend.trim()) parts.push({ text: textToSend });

        try {
            const responseStream = await chat.sendMessageStream({ message: parts });
            
            // Append an empty model message to start
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            let accumulatedText = "";

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    accumulatedText += chunkText;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        // Replace the last message (the model's message we just added) with the full accumulated text
                        const lastIndex = newMessages.length - 1;
                        if (newMessages[lastIndex].role === 'model') {
                            newMessages[lastIndex] = { ...newMessages[lastIndex], text: accumulatedText };
                        }
                        return newMessages;
                    });
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Oops! I ran into a little trouble. Can you try asking that again?" }]);
        } finally {
            setIsLoading(false);
        }
    }, [chat, input, isLoading, playSound, uploadedImage]);

    // Send initial message or handle translation request once
    useEffect(() => {
        if (chat && messages.length === 0 && !isLoading && !hasInitialized.current) {
            hasInitialized.current = true; // Prevent double firing in StrictMode
            const translationPrompt = location.state?.translationPrompt;
            if (translationPrompt) {
                handleSendMessage(translationPrompt);
            } else {
                if (isTeacher) {
                    handleSendMessage("Introduce yourself as my Teaching Assistant and ask how you can help with my classes today.");
                } else {
                    const isUrdu = user?.studyLanguage === 'Urdu';
                    handleSendMessage(isUrdu ? "Introduce yourself in Urdu." : "Introduce yourself as Marky and ask what I want to study.");
                }
            }
        }
    }, [chat, messages.length, isLoading, handleSendMessage, location.state, user, isTeacher]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage({ data: (reader.result as string).split(',')[1], mimeType: file.type });
            };
            reader.readAsDataURL(file);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };
    
    const PromptSuggestion: React.FC<{ text: string }> = ({ text }) => (
        <button 
            onClick={() => handleSendMessage(text)}
            className="p-2.5 text-left bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
            {text}
        </button>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-8.5rem)] bg-card-light dark:bg-card-dark rounded-2xl shadow-xl animate-fade-in">
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-secondary-light text-white text-lg flex-shrink-0">
                                    {isTeacher ? ICONS.sparkles : ICONS.studyBuddy}
                                </div>
                            )}
                            <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary-light text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700/50 rounded-bl-none'}`}>
                                {msg.image && <img src={msg.image} alt="User upload" className="mb-2 rounded-lg max-w-full" />}
                                {msg.text && <p className="text-sm whitespace-pre-wrap" dir={msg.role === 'model' && user?.studyLanguage === 'Urdu' && !isTeacher ? 'rtl' : 'ltr'} dangerouslySetInnerHTML={{ __html: msg.text.replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">$1</code>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />}
                            </div>
                            {msg.role === 'user' && (
                                <img src={user?.avatar} alt="You" className="w-10 h-10 rounded-full flex-shrink-0" />
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex gap-3 justify-start">
                             <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-light to-secondary-light text-white text-lg flex-shrink-0">
                                {isTeacher ? ICONS.sparkles : ICONS.studyBuddy}
                            </div>
                            <div className="max-w-md lg:max-w-lg p-3 rounded-2xl bg-slate-100 dark:bg-slate-700/50 rounded-bl-none">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
             {messages.length <= 2 && !isLoading && (
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <p className="text-sm font-semibold mb-2 text-center text-subtle-dark dark:text-subtle-light">Try asking:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                       {isTeacher ? (
                           <>
                               <PromptSuggestion text="Draft a lesson plan for next week" />
                               <PromptSuggestion text="Create a quiz about The Solar System" />
                               <PromptSuggestion text="Write a welcome email to parents" />
                               <PromptSuggestion text="Ideas for engaging a bored class" />
                           </>
                       ) : (
                           <>
                               <PromptSuggestion text="Explain photosynthesis like I'm 12" />
                               <PromptSuggestion text="Give me a practice problem for basic algebra" />
                               <PromptSuggestion text="Summarize the main causes of World War I" />
                               <PromptSuggestion text="What's the difference between DNA and RNA?" />
                           </>
                       )}
                    </div>
                </div>
            )}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
                {uploadedImage && (
                    <div className="p-2">
                        <div className="relative inline-block">
                            <img src={`data:${uploadedImage.mimeType};base64,${uploadedImage.data}`} alt="upload preview" className="h-20 w-auto rounded-lg" />
                            <button onClick={() => setUploadedImage(null)} className="absolute -top-2 -right-2 p-1 bg-danger text-white rounded-full shadow-lg">{React.cloneElement(ICONS.close, {className: 'w-4 h-4'})}</button>
                        </div>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        {React.cloneElement(ICONS.paperclip, { className: 'w-6 h-6' })}
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask me anything, or upload an image..."
                        disabled={isLoading}
                        className="flex-1 w-full p-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light transition"
                    />
                    <button type="submit" disabled={isLoading || (!input.trim() && !uploadedImage)} className="p-3 bg-primary-light text-white rounded-lg disabled:opacity-50 transition-colors">
                        {React.cloneElement(ICONS.arrowRight, { className: 'w-6 h-6 -rotate-45' })}
                    </button>
                </form>
            </div>
        </div>
    );
};
