

import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ICONS } from '../constants';
import { SoundContext } from '../contexts/SoundContext';

export const LoginPage: React.FC = () => {
    const [realName, setRealName] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const authContext = useContext(AuthContext);
    const soundContext = useContext(SoundContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const personaData = location.state;

    useEffect(() => {
        // If user lands here without persona data, send them back
        if(!personaData) {
            navigate('/persona');
        }
    }, [personaData, navigate]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        soundContext?.playSound('click');
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (realName.trim() && email.trim() && avatar && birthDate && personaData) {
            soundContext?.playSound('achieve');
            authContext?.login({ 
                id: new Date().toISOString(),
                realName: realName.trim(), 
                email: email.trim(), 
                avatar, 
                birthDate,
                ...personaData 
            });
        }
    };

    const isFormValid = realName.trim() && email.trim() && avatar && birthDate;

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                     <div className="inline-block p-4 bg-gradient-to-br from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/20 dark:to-secondary-dark/20 text-primary-light dark:text-primary-dark rounded-3xl mb-4 animate-bounce-in">
                        {React.cloneElement(ICONS.logo, {className: "w-12 h-12"})}
                     </div>
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-transparent bg-clip-text">
                        Mark
                    </h1>
                    <p className="text-subtle-dark dark:text-subtle-light mt-2">Just a few more details to create your account.</p>
                </div>
                <div className="bg-card-light dark:bg-card-dark p-8 rounded-3xl shadow-2xl animate-pop-in" style={{animationDelay: '200ms'}}>
                    <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="flex flex-col items-center">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-subtle-dark dark:text-subtle-light overflow-hidden transition-all transform hover:scale-105 hover:shadow-lg">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover"/>
                                ) : (
                                    <span className="text-3xl">{ICONS.upload}</span>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-xs font-bold">Choose</p>
                                </div>
                            </button>
                        </div>
                        <div>
                            <label htmlFor="realName" className="block text-sm font-medium text-subtle-dark dark:text-subtle-light mb-2">Full Name</label>
                            <input
                                id="realName" type="text" value={realName}
                                onChange={(e) => setRealName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-subtle-dark dark:text-subtle-light mb-2">Email Address</label>
                            <input
                                id="email" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
                                required
                            />
                        </div>
                         <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-subtle-dark dark:text-subtle-light mb-2">Birth Date</label>
                            <input
                                id="birthDate" type="date" value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 text-lg font-bold text-white bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark rounded-lg shadow-lg hover:opacity-90 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                            disabled={!isFormValid}
                        >
                            Start Learning
                        </button>
                    </form>
                </div>
                <div className="text-center mt-6">
                     <button onClick={() => { soundContext?.playSound('click'); navigate("/persona"); }} className="text-sm text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                        &larr; Back to questions
                    </button>
                </div>
                 <p className="text-center text-xs text-subtle-dark dark:text-subtle-light mt-4">
                    This is a prototype. No data is stored permanently.
                </p>
            </div>
        </div>
    );
};
