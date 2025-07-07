// hooks/useTimer.ts
'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import audioManager from '../lib/audioManager';

export const useTimer = () => {
    const isRunning = useTimerStore((state) => state.isRunning);
    const timeLeft = useTimerStore((state) => state.timeLeft);
    const mode = useTimerStore((state) => state.mode);
    const sessionsCompleted = useTimerStore((state) => state.sessionsCompleted);
    const decrementTime = useTimerStore((state) => state.decrementTime);
    const switchMode = useTimerStore((state) => state.switchMode);
    const incrementSessions = useTimerStore((state) => state.incrementSessions);
    const openCheckpointModal = useTimerStore((state) => state.openCheckpointModal);
    const openChallengeModal = useTimerStore((state) => state.openChallengeModal);
    const soundEnabled = useTimerStore((state) => state.soundSettings.enabled);
    const ambientSound = useTimerStore((state) => state.soundSettings.ambientSound);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // useEffect untuk interval timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                decrementTime();
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, decrementTime]);

    // useEffect untuk pergantian mode otomatis
    useEffect(() => {
        if (timeLeft === 0) {
            // Ambil state terbaru langsung dari store untuk menghindari stale state
            const currentState = useTimerStore.getState(); 
            
            if (currentState.mode === 'focus') {
                // 1. Tambah sesi
                currentState.incrementSessions();
                
                // 2. Ambil nilai TERBARU setelah increment
                const nextSessionsCount = useTimerStore.getState().sessionsCompleted;

                // 3. Tentukan mode/aksi berikutnya
                if (nextSessionsCount > 0 && nextSessionsCount % 4 === 0) {
                    currentState.openCheckpointModal();
                    currentState.switchMode('longBreak');
                } else {
                    currentState.openChallengeModal();
                    currentState.switchMode('shortBreak');
                }
            } else {
                currentState.switchMode('focus');
            }
        }
        // Kita tidak perlu memasukkan semua fungsi ke dependency array
        // karena referensinya stabil.
    }, [timeLeft]);

    // // useEffect untuk audio
    // useEffect(() => {
    //     const shouldPlay = soundEnabled && isRunning && mode === 'focus';

    //     if (shouldPlay) {
    //         audioManager.playAmbient(ambientSound);
    //     } else {
    //         audioManager.stopAmbient();
    //     }

    //     return () => {
    //         audioManager.stopAmbient();
    //     };
    // }, [isRunning, mode, soundEnabled, ambientSound]);
};