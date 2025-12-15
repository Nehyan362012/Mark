
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, PUZZLES } from '../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { QuizContext } from '../contexts/QuizContext';
import { PuzzleInfo, CustomGame } from '../types';

const CustomGameCard: React.FC<{ game: CustomGame; onClick: () => void }> = ({ game, onClick }) => (
    <div onClick={onClick} className="group relative bg-card-light dark:bg-card-dark rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-8px)_rotateY(10deg)] cursor-pointer hover:shadow-2xl">
        <div className="w-24 h-24 rounded-full mb-4 overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-700">
            <img src={game.icon} alt={game.title} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-2xl font-bold">{game.title}</h3>
        <p className="text-subtle-dark dark:text-subtle-light mt-2 flex-grow text-sm">{game.description}</p>
        <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 dark:bg-yellow-400/20 px-2 py-1 rounded-full mt-4">
            AI-Generated
        </p>
    </div>
);


export const MathArcadePage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const { customGames } = useContext(QuizContext)!;
    const { playSound } = useContext(SoundContext)!;

    const handlePuzzleClick = (puzzle: PuzzleInfo) => {
        playSound('click');
        unlockAchievement('puzzle-starter');
        navigate(puzzle.path);
    }
    
    const handleCustomGameClick = (game: CustomGame) => {
        playSound('click');
        navigate(`/custom-game/${game.id}`);
    }

    return (
        <div className="space-y-12">
            <div>
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                        Math Arcade
                    </h1>
                    <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                        Test your numerical skills with these fun, interactive challenges!
                    </p>
                </div>

                <div className="puzzle-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PUZZLES.map((puzzle, index) => (
                        <div
                            key={puzzle.title}
                            onClick={() => handlePuzzleClick(puzzle)}
                            style={{ animation: `pop-in 0.5s ${index * 100}ms ease-out forwards`, opacity: 0 }}
                            className={`group relative bg-card-light dark:bg-card-dark rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-8px)_rotateY(10deg)] cursor-pointer hover:shadow-2xl`}
                        >
                            <div className={`p-5 rounded-full bg-gradient-to-br from-primary-light to-secondary-light text-white mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                {/* FIX: Added a check to ensure puzzle.icon is a valid React element before cloning. */}
                                {React.isValidElement(puzzle.icon) ? React.cloneElement(puzzle.icon as React.ReactElement<any>, { className: 'w-12 h-12' }) : puzzle.icon}
                            </div>
                            <h3 className="text-2xl font-bold">{puzzle.title}</h3>
                            <p className="text-subtle-dark dark:text-subtle-light mt-2 flex-grow">{puzzle.description}</p>
                             <p className="text-xs font-bold text-primary-light dark:text-primary-dark bg-primary-light/10 dark:bg-primary-dark/20 px-2 py-1 rounded-full mt-4">
                               {puzzle.subject}
                             </p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold">Your Custom Games</h2>
                    <p className="mt-2 text-md text-subtle-dark dark:text-subtle-light">Games you've created with the help of AI.</p>
                </div>

                <div className="puzzle-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <div
                        onClick={() => navigate('/create-game')}
                        className={`group relative bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer hover:border-primary-light dark:hover:border-primary-dark hover:bg-primary-light/5 dark:hover:bg-primary-dark/10`}
                    >
                        <div className={`p-5 rounded-full bg-slate-200 dark:bg-slate-700 text-primary-light dark:text-primary-dark mb-4`}>
                            {React.cloneElement(ICONS.sparkles, { className: 'w-12 h-12' })}
                        </div>
                        <h3 className="text-2xl font-bold">Create Your Own Game</h3>
                        <p className="text-subtle-dark dark:text-subtle-light mt-2 flex-grow">Have an idea? Bring it to life with AI!</p>
                    </div>
                    {customGames.map((game, index) => (
                         <div key={game.id} style={{ animation: `pop-in 0.5s ${index * 100}ms ease-out forwards`, opacity: 0 }}>
                            <CustomGameCard game={game} onClick={() => handleCustomGameClick(game)} />
                         </div>
                    ))}
                </div>
            </div>
        </div>
    );
};