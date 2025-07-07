// store/timerStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AmbientSound } from '../lib/audioManager';

// Tipe untuk mode timer
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Checkpoint {
    message: string;
    timestamp: string; // Kita akan simpan sebagai ISO string
}

// Tipe untuk pengaturan suara
interface SoundSettings {
    ambientSound: AmbientSound;
    enabled: boolean;
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
    isSettingsModalOpen: boolean;
    soundSettings: SoundSettings;
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
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    updateSettings: (newSettings: TimerState['settings']) => void;
    updateSoundSettings: (newSettings: Partial<SoundSettings>) => void;
    incrementSessions: () => void;
}

type StoredState = Pick<TimerState, 'settings' | 'soundSettings' | 'sessionsCompleted' | 'checkpoints'>;

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
    isSettingsModalOpen: false,
    soundSettings: { // <-- Nilai awal
        ambientSound: 'keyboard',
        enabled: true,
    },
};

// 3. Gabungkan semuanya dan buat store
export const useTimerStore = create(
    // Beritahu persist tipe lengkap DAN tipe yang disimpan
    persist<TimerState & TimerActions, [], [], StoredState>(
        (set, get) => ({
            ...initialState,

            openSettingsModal: () => set({ isSettingsModalOpen: true }),
            closeSettingsModal: () => set({ isSettingsModalOpen: false }),
            updateSettings: (newSettings) => {
                set({ settings: newSettings });
            },

            // Implementasi Aksi
            startTimer: () => set({ isRunning: true }),

            pauseTimer: () => set({ isRunning: false }),

            decrementTime: () => {
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

            incrementSessions: () => {
                set((state) => ({ sessionsCompleted: state.sessionsCompleted + 1 }));
            },

            switchMode: (newMode: TimerMode) => {
                const { settings } = get();

                // Hapus SEMUA logika yang berhubungan dengan sessionsCompleted dari sini.
                // switchMode sekarang hanya bertanggung jawab untuk mengubah mode dan mengatur ulang waktu.

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

                set({
                    mode: newMode,
                    isRunning: false,
                    timeLeft: newTimeLeft,
                    // Hapus `sessionsCompleted` dari sini
                });
            },

            resetTimer: () => {
                const currentMode = get().mode;
                set((state) => ({
                    isRunning: false,
                    timeLeft: state.settings[currentMode] * 60,
                }));
            },
            updateSoundSettings: (newSettings) => {
                set((state) => ({
                    soundSettings: { ...state.soundSettings, ...newSettings },
                }));
            },
        }),
        {
            name: 'pomozone-storage',

            // 3. Gunakan tipe baru kita di sini
            partialize: (state): StoredState => ({
                settings: state.settings,
                soundSettings: state.soundSettings,
                sessionsCompleted: state.sessionsCompleted,
                checkpoints: state.checkpoints,
            }),
            onRehydrateStorage: () => (state, error) => {
                if (state) {
                    // Setelah data dimuat dari localStorage...
                    // Atur ulang timeLeft sesuai dengan mode dan settings yang tersimpan.
                    const currentMode = state.mode;
                    const savedSettings = state.settings;
                    state.timeLeft = savedSettings[currentMode] * 60;
                    state.isRunning = false; // Selalu pastikan timer tidak berjalan saat re-load
                }
            },
        }
    )
);
