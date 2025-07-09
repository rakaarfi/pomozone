// components/core/ModeSelector.tsx
'use client';

import { useTimerStore } from '../../store/timerStore';
import { motion } from 'framer-motion';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const ModeSelector = () => {
    const mode = useTimerStore((state) => state.mode);
    const switchMode = useTimerStore((state) => state.switchMode);
    const isRunning = useTimerStore((state) => state.isRunning);

    const modes: { id: TimerMode; label: string }[] = [
        { id: 'focus', label: 'Focus' },
        { id: 'shortBreak', label: 'Short Break' },
        { id: 'longBreak', label: 'Long Break' },
    ];

    const handleModeChange = (newMode: TimerMode) => {
        if (isRunning) {
            if (!confirm('The timer is running. Are you sure you want to switch? This will reset the current timer.')) {
                return;
            }
        }
        switchMode(newMode);
    };

    return (
        <div 
            className="flex justify-center gap-1 rounded-full p-1.5" 
            style={{ backgroundColor: 'var(--bg-selector)' }}
        >
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`relative w-32 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors
                        ${mode === m.id 
                            ? 'text-[var(--bg)]'
                            : 'text-[var(--comment)] hover:text-[var(--text)]'
                        }
                    `}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                >
                        
                    {mode === m.id && (
                        <motion.div
                            layoutId="active-mode-pill"
                            className="absolute inset-0 rounded-full bg-[var(--accent)]"
                            transition={{ type: "spring", stiffness: 350, damping: 35 }}
                        />
                    )}

                    <span className="relative z-10">{m.label}</span>
                </button>
            ))}
        </div>
    );
};