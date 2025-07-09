// components/core/ThemeToggleButton.tsx
'use client';

import { useTimerStore } from '../../store/timerStore';

// Ikon SVG sederhana sebagai komponen
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m4.93 17.66 1.41-1.41" />
        <path d="m17.66 4.93 1.41-1.41" />
    </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
);

const SystemIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
        <line x1="12" x2="12" y1="16" y2="20" />
        <line x1="8" x2="16" y1="20" y2="20" />
    </svg>
);

export const ThemeToggleButton = () => {
    const theme = useTimerStore((state) => state.theme);
    const setTheme = useTimerStore((state) => state.setTheme);

    const handleThemeChange = () => {
        console.log('Current theme:', theme);
        
        if (theme === 'system') {
            setTheme('light');
            console.log('Switching to light');
        } else if (theme === 'light') {
            setTheme('dark');
            console.log('Switching to dark');
        } else {
            setTheme('system');
            console.log('Switching to system');
        }
    };

    const renderIcon = () => {
        switch (theme) {
            case 'light':
                return <SunIcon className="w-5 h-5" />;
            case 'dark':
                return <MoonIcon className="w-5 h-5" />;
            case 'system':
            default:
                return <SystemIcon className="w-5 h-5" />;
        }
    };

    const getTooltipText = () => {
        switch (theme) {
            case 'light':
                return 'Theme: Light';
            case 'dark':
                return 'Theme: Dark';
            case 'system':
            default:
                return 'Theme: System';
        }
    };

    return (
        <button
            onClick={handleThemeChange}
            className="group relative rounded-md bg-white/10 p-2 text-sm font-bold transition-colors hover:bg-white/20"
            style={{ color: 'var(--text)' }}
            aria-label={`Change theme. Current: ${theme}`}
        >
            {renderIcon()}
            {/* Tooltip sederhana yang muncul saat hover */}
            <span 
                className="absolute top-full right-0 mt-2 w-max rounded-md px-2 py-1 text-xs opacity-0 shadow-lg ring-1 transition-opacity group-hover:opacity-100"
                style={{ 
                    backgroundColor: 'var(--bg-subtle)', 
                    color: 'var(--text)',
                    borderColor: 'var(--border-color)'
                }}
            >
                {getTooltipText()}
            </span>
        </button>
    );
};