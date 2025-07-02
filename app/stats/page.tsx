// app/stats/page.tsx
'use client';

import Link from 'next/link';
import { useTimerStore } from '../../store/timerStore';
import { Checkpoint } from '../../store/timerStore'; // Impor tipe data


// Fungsi bantuan untuk memformat tanggal
const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

export default function StatsPage() {
    // Ambil data yang sudah tersimpan dari store
    const checkpoints = useTimerStore((state) => state.checkpoints);
    const sessionsCompleted = useTimerStore((state) => state.sessionsCompleted);
    const focusDuration = useTimerStore((state) => state.settings.focus);

    const totalFocusTime = sessionsCompleted * focusDuration; // Dalam menit

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-12">
            <div className="w-full max-w-2xl space-y-8">

                {/* Header dengan tombol kembali */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-[--accent]">
                        Session Statistics
                    </h1>
                    <Link href="/" className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold text-[--text] transition-colors hover:bg-white/20">
                        ← Back to Timer
                    </Link>
                </div>

                {/* Kotak Statistik Utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-[--bg] p-6 shadow-lg ring-1 ring-white/10">
                        <p className="text-sm text-[--comment]">Total Focus Sessions</p>
                        <p className="text-4xl font-bold text-[--text]">{sessionsCompleted}</p>
                    </div>
                    <div className="rounded-lg bg-[--bg] p-6 shadow-lg ring-1 ring-white/10">
                        <p className="text-sm text-[--comment]">Total Focus Time</p>
                        <p className="text-4xl font-bold text-[--text]">
                            {totalFocusTime} <span className="text-lg text-[--comment]">mins</span>
                        </p>
                    </div>
                </div>

                {/* Riwayat Checkpoint / "Commit Log" */}
                <div>
                    <h2 className="text-xl font-bold text-[--text]">Checkpoint Log</h2>
                    <div className="mt-4 space-y-4">
                        {checkpoints.length > 0 ? (
                            // Balik array agar yang terbaru di atas
                            [...checkpoints].reverse().map((checkpoint, index) => (
                                <div key={index} className="rounded-lg bg-[--bg] p-4 ring-1 ring-white/10">
                                    <p className="font-mono text-sm text-[--comment]">
                                        commit <span className="text-yellow-400">{`#${checkpoints.length - index}`}</span> @ {formatTimestamp(checkpoint.timestamp)}
                                    </p>
                                    <p className="mt-2 text-[--text]">{checkpoint.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-[--comment]">No checkpoints recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}