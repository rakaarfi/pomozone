// components/core/ThemeManager.tsx
'use client';

import { useCallback, useEffect } from 'react';
import { useTimerStore } from '../../store/timerStore';

export const ThemeManager = () => {
    const theme = useTimerStore((state) => state.theme);
    // const setTheme = useTimerStore((state) => state.setTheme);

    // Fungsi untuk mengecek apakah system dalam dark mode
    const getSystemTheme = useCallback(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }, []);

    // Fungsi untuk apply theme ke DOM
    const applyTheme = useCallback((currentTheme: string) => {
        if (typeof window === 'undefined') return;

        const root = window.document.documentElement;
        const isDark = currentTheme === 'dark' ||
            (currentTheme === 'system' && getSystemTheme() === 'dark');

        root.classList.toggle('dark', isDark);

        // Debug log
        console.log('Theme applied:', { currentTheme, isDark, systemTheme: getSystemTheme() });
    }, [getSystemTheme]);

    // Effect untuk apply theme saat pertama kali load dan saat theme berubah
    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    // Effect untuk listen ke system theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            console.log('System theme changed:', e.matches ? 'dark' : 'light');
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        // Listen untuk perubahan system theme
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme, applyTheme]);

    // Effect untuk initialize theme pada first load
    useEffect(() => {
        // Pastikan theme di-apply dengan benar saat component mount
        applyTheme(theme);
    }, [applyTheme, theme]);

    return null;
};