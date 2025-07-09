// components/core/ThemeManager.tsx
'use client';

import { useCallback, useEffect } from 'react';
import { useTimerStore } from '../../store/timerStore';

export const ThemeManager = () => {
    const theme = useTimerStore((state) => state.theme);

    const getSystemTheme = useCallback(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }, []);

    const applyTheme = useCallback((currentTheme: string) => {
        if (typeof window === 'undefined') return;

        const root = window.document.documentElement;
        const isDark = currentTheme === 'dark' ||
            (currentTheme === 'system' && getSystemTheme() === 'dark');

        root.classList.toggle('dark', isDark);

        console.log('Theme applied:', { currentTheme, isDark, systemTheme: getSystemTheme() });
    }, [getSystemTheme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            console.log('System theme changed:', e.matches ? 'dark' : 'light');
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [theme, applyTheme]);

    useEffect(() => {
        applyTheme(theme);
    }, [applyTheme, theme]);

    return null;
};