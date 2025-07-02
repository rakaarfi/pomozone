// app/page.tsx
'use client';

import { useTimerStore } from '../store/timerStore';
import { useTimer } from '../hooks/useTimer';
import { ModeSelector } from '../components/core/ModeSelector';
import { TerminalOutput } from '../components/core/TerminalOutput'; // Impor komponen baru
import { formatTime } from '../lib/utils'; // Impor dari file utilitas
import { ChallengeModal } from '@/components/core/ChallengeModal';

export default function Home() {
  useTimer();

  // Ambil state dan aksi secara individual (aturan emas!)
  const isRunning = useTimerStore((state) => state.isRunning);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-12">
      {/* Ini adalah "Panel Terminal" utama kita */}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[--bg] p-6 shadow-2xl ring-1 ring-white/10">

        {/* 1. Mode Selector di paling atas */}
        <ModeSelector />

        {/* 2. Area Tampilan Utama */}
        <div className="text-center">
          <h1 className="text-8xl font-bold text-[--text] tracking-tighter">
            {formatTime(timeLeft)}
          </h1>
        </div>

        {/* 3. Output Terminal Dinamis */}
        <TerminalOutput />

        {/* 4. Area Kontrol di paling bawah */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="px-4 py-3 text-sm font-bold uppercase text-[--comment] transition-colors hover:text-[--text]"
          >
            Reset
          </button>
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="w-40 rounded-md bg-[--accent] py-3 text-lg font-bold uppercase text-[--bg] transition-opacity hover:opacity-90"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>

      </div>
      <ChallengeModal />
    </main>
  );
}