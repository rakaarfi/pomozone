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
            const currentState = useTimerStore.getState(); 
            
            if (currentState.mode === 'focus') {
                currentState.incrementSessions();
                
                const nextSessionsCount = useTimerStore.getState().sessionsCompleted;

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
    }, [timeLeft]);
};