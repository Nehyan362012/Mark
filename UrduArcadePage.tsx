
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, URDU_PUZZLES } from '../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SoundContext } from '../contexts/SoundContext';
import { PuzzleInfo } from '../types';


export const UrduArcadePage: React.FC = () => {
    const navigate = useNavigate();
    const { unlockAchievement } = useContext(AuthContext)!;
    const { playSound } = useContext(SoundContext)!;

    const handlePuzzleClick = (puzzle: PuzzleInfo) => {
        playSound('click');
        unlockAchievement('puzzle-starter');
        navigate(puzzle.path);
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text-light dark:text-text-dark">
                    Urdu Arcade
                </h1>
                <p className="mt-3 text-lg text-subtle-dark dark:text-subtle-light">
                    Test your language skills with these fun, interactive challenges!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {URDU_PUZZLES.map((puzzle, index) => {
                    return (
                        <div
                            key={puzzle.title}
                            onClick={() => handlePuzzleClick(puzzle)}
                            style={{ animation: `pop-in 0.5s ${index * 100}ms ease-out forwards`, opacity: 0 }}
                            className={`group relative bg-card-light dark:bg-card-dark rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 transform-style-preserve-3d hover:[transform:translateY(-8px)_rotateY(10deg)] cursor-pointer hover:shadow-2xl`}
                        >
                            <div className={`p-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-4 transition-transform duration-300 group-hover:scale-110`}>
                                {React.cloneElement(puzzle.icon, { className: 'w-12 h-12' })}
                            </div>
                            <h3 className="text-2xl font-bold">{puzzle.title}</h3>
                            <p className="text-subtle-dark dark:text-subtle-light mt-2 flex-grow">{puzzle.description}</p>
                             <p className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-500/10 dark:bg-green-400/20 px-2 py-1 rounded-full mt-4">
                               {puzzle.subject}
                             </p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
