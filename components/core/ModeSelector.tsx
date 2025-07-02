// components/core/ModeSelector.tsx
'use client';

import { useTimerStore } from '../../store/timerStore';

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
        <div className="flex justify-center gap-2 rounded-full bg-[--bg] p-1.5 shadow-inner">
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => handleModeChange(m.id)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors
            ${mode === m.id
                            ? 'bg-[--accent] text-[--bg]'
                            : 'text-[--comment] hover:text-[--text]'
                        }
          `}
                >
                    {m.label}
                </button>
            ))}
        </div>
    );
};