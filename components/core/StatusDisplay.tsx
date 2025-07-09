// components/core/StatusDisplay.tsx
'use client';

import { useTimerStore } from '../../store/timerStore';
import { motion, AnimatePresence } from 'framer-motion';

const FocusInput = () => {
    const currentTask = useTimerStore((state) => state.currentTask);
    const setCurrentTask = useTimerStore((state) => state.setCurrentTask);
    const isRunning = useTimerStore((state) => state.isRunning);

    return (
        <div className="relative w-full h-full">
            {/* 1. Tandai input sebagai 'peer' */}
            <input
                type="text"
                value={currentTask}
                onChange={(e) => setCurrentTask(e.target.value)}
                disabled={isRunning}
                // Tambahkan 'peer' di sini
                className="peer w-full h-full bg-transparent text-center text-sm text-[var(--text)]
                    focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Current focus task"
            />

            {/* 2. Buat placeholder bereaksi terhadap peer-focus */}
            {!currentTask && !isRunning && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none 
                               transition-opacity duration-200 peer-focus:opacity-0 whitespace-nowrap"
                >
                    <p className="text-sm text-[var(--comment)]">
                        What are you working on?&nbsp;
                    </p>
                </div>
            )}

            {/* 3. Buat kursor kustom bereaksi terhadap peer-focus */}
            {!currentTask && !isRunning && (
                <span
                    className="absolute top-1/2 right-1/2 h-4 w-px -translate-y-1/2
                                 translate-x-[10.5ch] animate-cursor-blink bg-[var(--comment)]
                                 peer-focus:hidden"
                >
                </span>
            )}
        </div>
    );
};

const BreakMessage = ({ mode }: { mode: 'shortBreak' | 'longBreak' }) => {
    const message = mode === 'shortBreak'
        ? "// Short break... time to recharge."
        : "// Long break. You've earned it! Stretch your legs.";

    return (
        <div className="max-w-80 text-center">
            <p className="text-sm text-[var(--comment)]">{message}</p>
        </div>
    );
};

export const StatusDisplay = () => {
    const mode = useTimerStore((state) => state.mode);

    return (
        <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    {mode === 'focus' && <FocusInput />}
                    {mode === 'shortBreak' && <BreakMessage mode="shortBreak" />}
                    {mode === 'longBreak' && <BreakMessage mode="longBreak" />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};