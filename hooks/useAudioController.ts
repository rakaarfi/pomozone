// hooks/useAudioController.ts
'use client';

import { useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';
import audioManager from '../lib/audioManager';

export const useAudioController = () => {
    const isRunning = useTimerStore((state) => state.isRunning);
    const mode = useTimerStore((state) => state.mode);
    const soundEnabled = useTimerStore((state) => state.soundSettings.enabled);
    const ambientSound = useTimerStore((state) => state.soundSettings.ambientSound);

    useEffect(() => {
        const shouldPlay = soundEnabled && isRunning && mode === 'focus';

        if (shouldPlay) {
            audioManager.play(ambientSound);
        } else {
            audioManager.stop();
        }
    }, [isRunning, mode, soundEnabled, ambientSound]);

    useEffect(() => {
        return () => {
            audioManager.stop();
        };
    }, []);
};