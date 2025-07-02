// store/timerStore.ts
import { create } from 'zustand';

// Tipe untuk mode timer
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

// 1. Definisikan tipe data untuk state kita (apa saja yang perlu disimpan)
interface TimerState {
    mode: TimerMode;
    timeLeft: number; // Waktu dalam detik
    isRunning: boolean;
    sessionsCompleted: number;
    settings: {
        focus: number; // Durasi dalam menit
        shortBreak: number; // Durasi dalam menit
        longBreak: number; // Durasi dalam menit
    };
    isChallengeModalOpen: boolean;
}

// 2. Definisikan tipe data untuk aksi kita (fungsi untuk mengubah state)
interface TimerActions {
    startTimer: () => void;
    pauseTimer: () => void;
    decrementTime: () => void;
    switchMode: (newMode: TimerMode) => void;
    resetTimer: () => void;
    openChallengeModal: () => void; // <-- Aksi baru
    closeChallengeModal: () => void; // <-- Aksi baru
}

// Nilai awal untuk state kita
const initialState: TimerState = {
    mode: 'focus',
    isRunning: false,
    sessionsCompleted: 0,
    settings: {
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
    },
    // Waktu awal diatur sesuai mode 'focus' dalam detik
    timeLeft: 3,
    isChallengeModalOpen: false, // <-- Nilai awal
};

// 3. Gabungkan semuanya dan buat store
export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
    ...initialState,

    // Implementasi Aksi
    startTimer: () => set({ isRunning: true }),

    pauseTimer: () => set({ isRunning: false }),

    decrementTime: () => {
        // get() digunakan untuk mengakses state saat ini di dalam aksi
        const currentTime = get().timeLeft;
        if (currentTime > 0) {
            set({ timeLeft: currentTime - 1 });
        }
    },

    switchMode: (newMode: TimerMode) => {
        const { settings, mode: currentMode, sessionsCompleted } = get();
        let newSessionsCompleted = sessionsCompleted;

        // Tambah sesi hanya jika kita selesai dari mode 'focus'
        if (currentMode === 'focus') {
            newSessionsCompleted += 1;
        }

        let newTimeLeft = 0;
        switch (newMode) {
            case 'shortBreak':
                newTimeLeft = settings.shortBreak * 60;
                break;
            case 'longBreak':
                newTimeLeft = settings.longBreak * 60;
                break;
            case 'focus':
            default:
                newTimeLeft = settings.focus * 60;
                break;
        }

        if (newMode === 'shortBreak' || newMode === 'longBreak') {
            set({ isChallengeModalOpen: true });
        }

        set({
            mode: newMode,
            isRunning: false,
            timeLeft: newTimeLeft,
            sessionsCompleted: newSessionsCompleted,
        });
    },

    openChallengeModal: () => set({ isChallengeModalOpen: true }),
    closeChallengeModal: () => set({ isChallengeModalOpen: false }),

    resetTimer: () => {
        // Untuk mereset, kita hanya perlu switch ke mode yang sedang aktif
        const currentMode = get().mode;
        get().switchMode(currentMode);
    }
}));
