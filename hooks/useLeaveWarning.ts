'use client';

import { useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';

export const useLeaveWarning = () => {
    const isRunning = useTimerStore((state) => state.isRunning);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (!isRunning) {
                return;
            }

            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isRunning]);
};