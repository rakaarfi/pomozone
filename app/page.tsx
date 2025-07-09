// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';
import { useTimer } from '../hooks/useTimer';
import { ModeSelector } from '../components/core/ModeSelector';
import { TerminalOutput } from '../components/core/TerminalOutput';
import { formatTime } from '../lib/utils';
import { ChallengeModal } from '@/components/core/ChallengeModal';
import { CheckpointModal } from '@/components/core/CheckpointModal';
import Link from 'next/link';
import { SettingsModal } from '../components/core/SettingsModal';
import { useAudioController } from '../hooks/useAudioController';
import { ThemeToggleButton } from '@/components/core/ThemeToggleButton';
import { useNotifications } from '@/hooks/useNotifications';

export default function Home() {
  useTimer();
  useAudioController();
  const { requestPermission } = useNotifications();

  const isRunning = useTimerStore((state) => state.isRunning);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const openSettingsModal = useTimerStore((state) => state.openSettingsModal);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
    const permissionTimeout = setTimeout(() => {
      requestPermission();
    }, 3000);

    return () => clearTimeout(permissionTimeout);
  }, [requestPermission]);

  const handleResetClick = () => {
    if (isRunning) {
      if (window.confirm('The timer is running. Are you sure you want to reset?')) {
        resetTimer();
      }
    } else {
      resetTimer();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-12">

      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggleButton />
        <button
          onClick={openSettingsModal}
          className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-[--text] transition-colors hover:bg-white/20"
        >
          Settings
        </button>
        <Link href="/stats" className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-[--text] transition-colors hover:bg-white/20">
          Stats →
        </Link>
      </div>

      {/* Panel Terminal Utama */}
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[--bg] p-6 shadow-2xl ring-1 ring-white/10">

        {/* 1. Mode Selector di paling atas */}
        <ModeSelector />

        {/* 2. Area Tampilan Utama */}
        <div className="text-center h-[96px] flex items-center justify-center">
          {hasHydrated ? (
            <h1 className="text-8xl font-bold text-[--text] tracking-tighter">
              {formatTime(timeLeft)}
            </h1>
          ) : (
            <h1 className="text-8xl font-bold text-[--comment] tracking-tighter">
              --:--
            </h1>
          )}
        </div>

        {/* 3. Output Terminal Dinamis */}
        <TerminalOutput />

        {/* 4. Area Kontrol di paling bawah */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleResetClick}
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
      <CheckpointModal />
      <SettingsModal />
    </main>
  );
}