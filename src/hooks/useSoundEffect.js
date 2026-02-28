import { useCallback, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const useSoundEffect = () => {
    const { settings } = useContext(AppContext);

    const playSound = useCallback((type) => {
        // Default to true if undefined so sound plays for existing users
        const isEnabled = settings.isSoundEnabled !== false;

        if (!isEnabled) {
            return;
        }

        const soundPath = (path) => `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

        let audioSrc;
        if (type === 'correct') {
            audioSrc = soundPath('sounds/correct.mp3');
        } else if (type === 'wrong') {
            audioSrc = soundPath('sounds/wrong.mp3');
        }

        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play()
                .catch(error => {
                    console.warn(`Audio playback failed for ${type}:`, error);
                });
        }
    }, [settings.isSoundEnabled]);

    const playCorrect = useCallback(() => playSound('correct'), [playSound]);
    const playWrong = useCallback(() => playSound('wrong'), [playSound]);

    return { playCorrect, playWrong };
};

export default useSoundEffect;
