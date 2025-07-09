// app/stats/page.tsx
'use client';

import Link from 'next/link';
import { useTimerStore } from '../../store/timerStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Fungsi bantuan untuk memformat tanggal
const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

// Fungsi helper untuk memproses data checkpoint
const processCheckpointData = (checkpoints: { timestamp: string }[]) => {
    // Siapkan data untuk 7 hari terakhir, termasuk hari ini
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            date: d.toISOString().split('T')[0], // Format YYYY-MM-DD
            name: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue", etc.
            sessions: 0,
        };
    }).reverse();

    const dateMap = new Map(last7Days.map(day => [day.date, day]));

    // Setiap checkpoint mewakili 4 sesi fokus
    const SESSIONS_PER_CHECKPOINT = 4;

    checkpoints.forEach(checkpoint => {
        const checkpointDate = checkpoint.timestamp.split('T')[0];
        if (dateMap.has(checkpointDate)) {
            const dayData = dateMap.get(checkpointDate);
            if (dayData) {
                dayData.sessions += SESSIONS_PER_CHECKPOINT;
            }
        }
    });

    return Array.from(dateMap.values());
};

export default function StatsPage() {
    const checkpoints = useTimerStore((state) => state.checkpoints);
    const sessionsCompleted = useTimerStore((state) => state.sessionsCompleted);
    const focusDuration = useTimerStore((state) => state.settings.focus);

    const totalFocusTime = sessionsCompleted * focusDuration; // Dalam menit

    const chartData = processCheckpointData(checkpoints);
    const hasChartData = chartData.some(day => day.sessions > 0);

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-12">
            <div className="w-full max-w-4xl space-y-8">

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

                {/* Grafik Produktivitas */}
                <div>
                    <h2 className="text-xl font-bold text-[--text]">Productivity Chart</h2>
                    <p className="text-sm text-[--comment]">Completed focus sessions in the last 7 days.</p>
                    <div className="mt-4 h-80 w-full rounded-lg bg-[--bg-subtle] p-4 ring-1 ring-[var(--border-color)]">
                        {hasChartData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="name" stroke="var(--comment)" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--comment)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--bg)',
                                            borderColor: 'var(--border-color)',
                                            color: 'var(--text)',
                                            borderRadius: '0.5rem',
                                        }}
                                        cursor={{ fill: 'var(--bg-interactive-hover)' }}
                                    />
                                    <Bar dataKey="sessions" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <p className="text-center text-[--comment]">
                                    No productivity data yet. <br /> Complete a full cycle (4 focus sessions) to see your stats here.
                                </p>
                            </div>
                        )}
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