// store/timerStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AmbientSound } from '../lib/audioManager';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Checkpoint {
    message: string;
    timestamp: string;
}

// Tipe untuk pengaturan suara
interface SoundSettings {
    ambientSound: AmbientSound;
    enabled: boolean;
}

interface TimerState {
    mode: TimerMode;
    timeLeft: number; // detik
    isRunning: boolean;
    sessionsCompleted: number;
    settings: {
        focus: number; // menit
        shortBreak: number; // menit
        longBreak: number; // menit
    };
    isChallengeModalOpen: boolean;
    isCheckpointModalOpen: boolean;
    checkpoints: Checkpoint[];
    isSettingsModalOpen: boolean;
    soundSettings: SoundSettings;
}

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

type StoredState = Pick<TimerState, 'settings' | 'soundSettings' | 'sessionsCompleted' | 'checkpoints' | 'mode' | 'timeLeft' | 'isRunning'>;

const initialState: TimerState = {
    mode: 'focus',
    isRunning: false,
    sessionsCompleted: 0,
    settings: {
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
    },
    timeLeft: 25 * 60,
    isChallengeModalOpen: false,
    isCheckpointModalOpen: false,
    checkpoints: [],
    isSettingsModalOpen: false,
    soundSettings: {
        ambientSound: 'keyboard',
        enabled: true,
    },
};

export const useTimerStore = create(
    persist<TimerState & TimerActions, [], [], StoredState>(
        (set, get) => ({
            ...initialState,

            openSettingsModal: () => set({ isSettingsModalOpen: true }),
            closeSettingsModal: () => set({ isSettingsModalOpen: false }),
            updateSettings: (newSettings) => {
                set({ settings: newSettings });
            },

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

            partialize: (state): StoredState => ({
                settings: state.settings,
                soundSettings: state.soundSettings,
                sessionsCompleted: state.sessionsCompleted,
                checkpoints: state.checkpoints,
                mode: state.mode,
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
            }),
            // onRehydrateStorage: () => (state, error) => {
            //     if (state) {
            //         const currentMode = state.mode;
            //         const savedSettings = state.settings;
            //         state.timeLeft = savedSettings[currentMode] * 60;
            //         state.isRunning = false;
            //     }
            // },
        }
    )
);
