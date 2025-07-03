// hooks/useTimer.ts
'use client';

import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import audioManager from '../lib/audioManager';

export const useTimer = () => {
    // Ambil setiap nilai dan fungsi secara terpisah.
    // Ini adalah cara yang benar untuk menghindari re-render yang tidak perlu.
    const isRunning = useTimerStore((state) => state.isRunning);
    const timeLeft = useTimerStore((state) => state.timeLeft);
    const mode = useTimerStore((state) => state.mode);
    const sessionsCompleted = useTimerStore((state) => state.sessionsCompleted);
    const decrementTime = useTimerStore((state) => state.decrementTime);
    const switchMode = useTimerStore((state) => state.switchMode);
    const soundSettings = useTimerStore((state) => state.soundSettings);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // useEffect untuk interval timer (tidak ada perubahan di sini)
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

    // useEffect untuk pergantian mode otomatis (tidak ada perubahan di sini)
    useEffect(() => {
        if (timeLeft === 0) {
            if (mode === 'focus') {
                const nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
                switchMode(nextMode);
            } else {
                switchMode('focus');
            }
        }
    }, [timeLeft, mode, sessionsCompleted, switchMode]);

    useEffect(() => {
        // Cek apakah suara diaktifkan secara global DAN timer sedang berjalan di mode fokus
        const shouldPlay = soundSettings.enabled && isRunning && mode === 'focus';

        if (shouldPlay) {
            audioManager.playAmbient(soundSettings.ambientSound);
        } else {
            audioManager.stopAmbient();
        }

        // Fungsi cleanup untuk memastikan suara berhenti saat komponen unmount
        return () => {
            audioManager.stopAmbient();
        };
    }, [isRunning, mode, soundSettings]); // Bergantung pada state ini
};