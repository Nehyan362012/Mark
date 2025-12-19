
import { useCallback } from 'react';
import { Howl } from 'howler';

const SHORT_BEEP = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT19JAEwANwBEAEkASwBPAFcAVgBbAFwAWwBTAFIAAABLADoANgA0ADcAPwBDAEcASQBMAFAAUwBVAFYAVQBRAE0A';
const CLICK_BEEP = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
const SWOOSH_BEEP = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAAAAAA==';

const sounds = {
    correct: new Howl({ src: [SHORT_BEEP], volume: 0.5, rate: 1.5 }),
    incorrect: new Howl({ src: [SHORT_BEEP], volume: 0.5, rate: 0.6 }),
    click: new Howl({ src: [CLICK_BEEP], volume: 0.3 }),
    achieve: new Howl({ src: [SHORT_BEEP], volume: 0.5, rate: 2.0 }),
    navigate: new Howl({ src: [CLICK_BEEP], volume: 0.1, rate: 2 }),
    open: new Howl({ src: [CLICK_BEEP], volume: 0.2, rate: 1.2 }),
    close: new Howl({ src: [CLICK_BEEP], volume: 0.2, rate: 0.9 }),
    swoosh: new Howl({ src: [SWOOSH_BEEP], volume: 0.2 }),
    gameover: new Howl({ src: [SHORT_BEEP], volume: 0.5, rate: 0.4 }),
    pop: new Howl({ src: [CLICK_BEEP], volume: 0.4, rate: 1.8 }),
    delete: new Howl({ src: [SWOOSH_BEEP], volume: 0.3, rate: 0.7 }),
    toast_success: new Howl({ src: [SHORT_BEEP], volume: 0.5}),
    toast_error: new Howl({ src: [SHORT_BEEP], volume: 0.5, rate: 1.0 })
};

type SoundType = keyof typeof sounds;

export const useSound = (soundEnabled: boolean) => {
    const playSound = useCallback((sound: SoundType) => {
        if (soundEnabled && sounds[sound]) {
            sounds[sound].play();
        }
    }, [soundEnabled]);

    return { playSound };
};
