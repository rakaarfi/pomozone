// app/page.tsx
'use client';

import { useTimerStore } from '../store/timerStore';
import { useTimer } from '../hooks/useTimer';
import { ModeSelector } from '../components/core/ModeSelector';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function Home() {
  useTimer();

  const timeLeft = useTimerStore((state) => state.timeLeft);
  const isRunning = useTimerStore((state) => state.isRunning);
  const mode = useTimerStore((state) => state.mode);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 space-y-10">

      <ModeSelector />

      <div className="text-center">
        <h1 className="text-8xl font-bold text-[--text]">
          {formatTime(timeLeft)}
        </h1>
        <p className="mt-2 text-[--comment]">
          // mode: {mode}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="px-4 py-3 bg-transparent text-[--comment] font-bold rounded-md hover:text-[--text]"
        >
          RESET
        </button>
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="w-40 px-8 py-3 bg-[--accent] text-[--bg] font-bold rounded-md hover:opacity-90 transition-opacity"
        >
          {isRunning ? 'PAUSE' : 'START'}
        </button>
      </div>
    </main>
  );
}