
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SoundContext } from '../contexts/SoundContext';
import { ThemeContext } from '../contexts/ThemeContext';

// Simple icon components
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>;
const TabletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 5.25h15M4.5 9h15m-15 3.75h15M4.5 16.5h15M5.25 3v18h13.5V3H5.25Z" /></svg>;
const LaptopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621a3 3 0 0 1-.879-2.122v-1.007M15 15.75a3 3 0 0 0-3-3V4.5a3 3 0 0 0-3 3v8.25a3 3 0 0 0 3 3h3Z" /></svg>;


export const DeviceSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { playSound } = useContext(SoundContext)!;
    const { setDeviceType } = useContext(ThemeContext)!;

    const personaData = location.state;

    const handleSelect = (deviceType: 'phone' | 'desktop') => {
        playSound('click');
        setDeviceType(deviceType);
        navigate('/login', { state: personaData });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark p-4">
            <div className="w-full max-w-2xl mx-auto text-center">
                <div className="bg-card-light dark:bg-card-dark p-8 md:p-12 rounded-3xl shadow-2xl animate-fade-in-down">
                    <h1 className="text-4xl font-bold mb-4">How are you joining us?</h1>
                    <p className="text-subtle-dark dark:text-subtle-light mb-8">Select your device for the best experience.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <button onClick={() => handleSelect('phone')} className="flex flex-col items-center p-6 bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10 text-primary-light">
                            <PhoneIcon />
                            <span className="mt-4 font-semibold text-lg">Phone</span>
                        </button>
                         <button onClick={() => handleSelect('desktop')} className="flex flex-col items-center p-6 bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10 text-primary-light">
                            <TabletIcon />
                            <span className="mt-4 font-semibold text-lg">Tablet</span>
                        </button>
                         <button onClick={() => handleSelect('desktop')} className="flex flex-col items-center p-6 bg-bg-light dark:bg-bg-dark rounded-xl shadow-md transition-all transform hover:scale-105 hover:bg-primary-light/10 text-primary-light">
                            <LaptopIcon />
                            <span className="mt-4 font-semibold text-lg">Laptop</span>
                        </button>
                    </div>
                </div>
                 <button onClick={() => navigate('/persona')} className="mt-6 text-sm text-subtle-dark dark:text-subtle-light hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                    &larr; Back
                </button>
            </div>
        </div>
    );
};
