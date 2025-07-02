// store/timerStore.ts
import { create } from 'zustand';

// Tipe untuk mode timer
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Checkpoint {
    message: string;
    timestamp: string; // Kita akan simpan sebagai ISO string
}

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
    isCheckpointModalOpen: boolean;
    checkpoints: Checkpoint[];
}

// 2. Definisikan tipe data untuk aksi kita (fungsi untuk mengubah state)
interface TimerActions {
    startTimer: () => void;
    pauseTimer: () => void;
    decrementTime: () => void;
    switchMode: (newMode: TimerMode) => void;
    resetTimer: () => void;
    openChallengeModal: () => void;
    closeChallengeModal: () => void;
    openCheckpointModal: () => void;
    closeCheckpointModal: () => void;
    addCheckpoint: (message: string) => void;
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
    timeLeft: 25 * 60,
    isChallengeModalOpen: false,
    isCheckpointModalOpen: false,
    checkpoints: [],
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

    openCheckpointModal: () => set({ isCheckpointModalOpen: true }),

    closeCheckpointModal: () => {
        set({ isCheckpointModalOpen: false });
        // Setelah checkpoint ditutup, selalu buka modal challenge untuk long break
        get().openChallengeModal();
    },

    addCheckpoint: (message: string) => {
        const newCheckpoint: Checkpoint = {
            message,
            timestamp: new Date().toISOString(),
        };
        set((state) => ({
            checkpoints: [...state.checkpoints, newCheckpoint],
        }));
    },

    openChallengeModal: () => set({ isChallengeModalOpen: true }),
    closeChallengeModal: () => set({ isChallengeModalOpen: false }),

    switchMode: (newMode: TimerMode) => {
        const { settings, mode: currentMode, sessionsCompleted, openCheckpointModal, openChallengeModal } = get();
        let newSessionsCompleted = sessionsCompleted;

        if (currentMode === 'focus') {
            newSessionsCompleted += 1;
        }

        if (currentMode === 'focus' && (newSessionsCompleted % 4 === 0)) {
            // Kasus 1: Sesi ke-4 selesai. Buka HANYA Checkpoint.
            openCheckpointModal();
        } else if (newMode === 'shortBreak' || newMode === 'longBreak') {
            // Kasus 2: Break biasa. Langsung buka Challenge.
            openChallengeModal();
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


        // Pembaruan state terakhir yang bersih
        set({
            mode: newMode,
            isRunning: false,
            timeLeft: newTimeLeft,
            sessionsCompleted: newSessionsCompleted,
        });
    },

    resetTimer: () => {
        const currentMode = get().mode;
        set((state) => ({
            isRunning: false,
            timeLeft: state.settings[currentMode] * 60,
        }));
    },
}));
