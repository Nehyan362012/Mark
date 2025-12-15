import { useCallback } from 'react';

const colors = ['#A78BFA', '#D946EF', '#10B981', '#FBBF24', '#38BDF8'];

export const useConfetti = () => {
    const triggerConfetti = useCallback(() => {
        const container = document.getElementById('confetti-container');
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.random() * 8 + 4;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 2000);
        }
    }, []);

    return { triggerConfetti };
};
