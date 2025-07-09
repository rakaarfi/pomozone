// hooks/useKeyboardShortcuts.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useTimerStore } from '../store/timerStore';

export const useKeyboardShortcuts = () => {
    // Ambil semua state dan action yang kita butuhkan
    const {
        isRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        isChallengeModalOpen,
        isCheckpointModalOpen,
        isSettingsModalOpen
    } = useTimerStore();

    // Cek apakah ada modal yang sedang aktif
    const isAnyModalOpen = isChallengeModalOpen || isCheckpointModalOpen || isSettingsModalOpen;

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Jangan jalankan shortcut jika pengguna sedang mengetik di input field atau modal terbuka
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }
        if (isAnyModalOpen) {
            return;
        }

        // Cegah perilaku default browser untuk tombol spasi (scroll)
        if (event.code === 'Space') {
            event.preventDefault();
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        }

        // Shortcut untuk reset (misalnya, tombol 'R')
        if (event.code === 'KeyR') {
            event.preventDefault();
            // Minta konfirmasi jika timer berjalan, sama seperti tombol reset
            if (isRunning) {
                if (window.confirm('The timer is running. Are you sure you want to reset?')) {
                    resetTimer();
                }
            } else {
                resetTimer();
            }
        }

    }, [isRunning, startTimer, pauseTimer, resetTimer, isAnyModalOpen]);

    useEffect(() => {
        // Tambahkan event listener saat komponen mount
        window.addEventListener('keydown', handleKeyDown);

        // Hapus event listener saat komponen unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
};