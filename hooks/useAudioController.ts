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
            // Panggil fungsi play yang baru dan sederhana
            audioManager.play(ambientSound);
        } else {
            // Panggil fungsi stop yang baru dan sederhana
            audioManager.stop();
        }
    }, [isRunning, mode, soundEnabled, ambientSound]);

    // Efek cleanup saat komponen unmount (misal, pindah halaman)
    useEffect(() => {
        return () => {
            audioManager.stop();
        };
    }, []);
};