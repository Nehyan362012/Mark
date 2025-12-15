
import React from 'react';

export const Marky: React.FC<{ isTalking: boolean }> = ({ isTalking }) => {
    return (
        <svg viewBox="0 0 100 100" className={`w-48 h-48 transition-transform duration-300 ${isTalking ? 'animate-bounce' : 'animate-float'}`} style={{ animationDuration: isTalking ? '0.5s' : '3s' }}>
            <defs>
                <radialGradient id="grad-body" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--hue-primary), 80%, 70%)' }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--hue-primary), 80%, 50%)' }} />
                </radialGradient>
                 <radialGradient id="grad-eye" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="#eee" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {/* Glow effect behind */}
            <circle cx="50" cy="55" r="42" fill="hsl(var(--hue-primary), 80%, 70%)" filter="url(#glow)" opacity="0.3" className="animate-pulse-soft"/>
            
            {/* Body */}
            <circle cx="50" cy="55" r="40" fill="url(#grad-body)" />
            
            {/* Eyes */}
            <g className={isTalking ? "animate-pulse" : ""}>
                <circle cx="35" cy="50" r="12" fill="url(#grad-eye)" />
                <circle cx="65" cy="50" r="12" fill="url(#grad-eye)" />
                {/* Pupils */}
                <circle cx="37" cy="52" r="5" fill="black" />
                <circle cx="67" cy="52" r="5" fill="black" />
                {/* Highlights */}
                <circle cx="33" cy="47" r="3" fill="white" opacity="0.8" />
                <circle cx="63" cy="47" r="3" fill="white" opacity="0.8" />
            </g>

            {/* Mouth */}
            <path 
                d={isTalking ? "M 40 75 Q 50 88, 60 75" : "M 42 75 Q 50 82, 58 75"} 
                stroke="black" 
                strokeWidth="3" 
                fill={isTalking ? "black" : "transparent"} 
                strokeLinecap="round" 
                className="transition-all duration-200" 
            />
            
            {/* Antenna */}
            <path d="M 50 15 Q 60 5, 70 15" stroke="hsl(var(--hue-secondary), 70%, 60%)" strokeWidth="3" fill="none" />
            <circle cx="70" cy="15" r="5" fill="hsl(var(--hue-secondary), 70%, 60%)" className={isTalking ? "animate-ping" : ""} />
        </svg>
    );
};
