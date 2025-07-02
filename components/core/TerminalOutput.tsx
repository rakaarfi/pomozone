// components/core/TerminalOutput.tsx
'use client';

import { useTimerStore } from '../../store/timerStore';
import { formatTime } from '../../lib/utils'; // Impor dari file utilitas baru

export const TerminalOutput = () => {
    // Ambil semua state yang dibutuhkan secara individual
    const isRunning = useTimerStore((state) => state.isRunning);
    const mode = useTimerStore((state) => state.mode);
    const timeLeft = useTimerStore((state) => state.timeLeft);

    let message = '';

    // Tentukan pesan berdasarkan state saat ini
    if (isRunning) {
        if (mode === 'focus') {
            message = `// ${formatTime(timeLeft)} remaining... focus mode active. Keep it up!`;
        } else if (mode === 'shortBreak') {
            message = `// Short break... time to recharge. Back in ${formatTime(timeLeft)}.`;
        } else {
            message = `// Long break. You've earned it! Stretch your legs. ${formatTime(timeLeft)} left.`;
        }
    } else {
        if (mode === 'focus') {
            message = '// System idle. Press START to engage focus protocol.';
        } else {
            message = '// Break period. Press START when you are ready to resume.';
        }
    }

    return (
        <div className="h-10 text-center text-[--comment]">
            <p>{message}</p>
        </div>
    );
};