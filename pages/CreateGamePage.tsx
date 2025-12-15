
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../contexts/QuizContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { SoundContext } from '../contexts/SoundContext';
import * as geminiService from '../services/geminiService';
import { ICONS } from '../constants';

const LoadingState: React.FC<{ status: string }> = ({ status }) => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold text-subtle-dark dark:text-subtle-light">{status}</p>
    </div>
);


export const CreateGamePage: React.FC = () => {
    const navigate = useNavigate();
    const { addCustomGame } = useContext(QuizContext)!;
    const { addToast } = useContext(NotificationContext)!;
    const { playSound } = useContext(SoundContext)!;

    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');

    const handleGenerate = async () => {
        if (idea.trim().length < 10) {
            addToast("Please provide a more detailed idea for your game.", '⚠️', 'error');
            return;
        }
        
        setIsLoading(true);
        playSound('swoosh');

        try {
            // 1. Validate Idea
            setLoadingStatus('Validating your brilliant idea...');
            const validation = await geminiService.validateGameIdea(idea);

            if (!validation.feasible) {
                addToast(`This game idea is a bit too complex for me right now. ${validation.reason}`, '🤖', 'error');
                setIsLoading(false);
                return;
            }

            // 2. Generate Game Content
            setLoadingStatus(`Generating a '${validation.gameType}' game about ${validation.topic}...`);
            const gameContent = await geminiService.generateGameContent(validation.gameType, validation.topic, idea);

            // 3. Generate Image Prompt
            setLoadingStatus('Designing a cool icon...');
            const imagePrompt = await geminiService.generateGameImagePrompt(validation.topic, idea);

            // 4. Generate Image
            setLoadingStatus('Painting the cover art...');
            const imageBase64 = await geminiService.generateImage(imagePrompt);
            
            // 5. Assemble and Save
            setLoadingStatus('Assembling your game...');
            const newGame = {
                id: new Date().toISOString(),
                title: gameContent.title,
                description: gameContent.description,
                icon: `data:image/png;base64,${imageBase64}`,
                gameType: validation.gameType,
                gameData: gameContent.data,
            };

            addCustomGame(newGame);
            addToast("Your game is ready!", '🎉');
            playSound('achieve');
            navigate('/math-arcade');

        } catch (error) {
            console.error("Error creating game:", error);
            addToast("Something went wrong during game creation. Please try again.", '❌', 'error');
        } finally {
            setIsLoading(false);
            setLoadingStatus('');
        }
    };
    
    const charLimit = 280;

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
             <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-xl">
                {isLoading ? (
                    <LoadingState status={loadingStatus} />
                ) : (
                    <>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold">Create a Game with AI</h1>
                            <p className="text-subtle-dark dark:text-subtle-light mt-2">Describe a simple game, and I'll build it for you!</p>
                            <p className="text-xs text-subtle-dark dark:text-subtle-light mt-2">(e.g., "A game where you pick the bigger number" or "A quiz about planets")</p>
                        </div>

                        <div className="mt-8">
                            <textarea
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                maxLength={charLimit}
                                placeholder="Describe your game idea here..."
                                className="w-full h-40 p-4 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light"
                            />
                            <p className="text-right text-sm text-subtle-dark dark:text-subtle-light mt-1">
                                {idea.length} / {charLimit}
                            </p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full mt-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light rounded-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            Generate Game
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
