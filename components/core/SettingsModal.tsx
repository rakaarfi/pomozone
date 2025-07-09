// components/core/SettingsModal.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import { Modal } from '../ui/Modal';
import { useTimerStore } from '../../store/timerStore';
import { ambientSoundsList, type AmbientSound } from '../../lib/audioManager';
import { Tab, Listbox } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsFormState {
    timer: {
        focus: number;
        shortBreak: number;
        longBreak: number;
    };
    sound: {
        enabled: boolean;
        ambientSound: AmbientSound;
    };
}

export const SettingsModal = () => {
    const isOpen = useTimerStore((state) => state.isSettingsModalOpen);
    const closeModal = useTimerStore((state) => state.closeSettingsModal);
    const updateSettings = useTimerStore((state) => state.updateSettings);
    const updateSoundSettings = useTimerStore((state) => state.updateSoundSettings);
    const currentSettings = useTimerStore((state) => state.settings);
    const currentSoundSettings = useTimerStore((state) => state.soundSettings);
    const isTimerRunning = useTimerStore((state) => state.isRunning);
    const resetTimerForUpdate = useTimerStore((state) => state.resetTimer);

    // --- State Lokal untuk Form & UI Feedback ---
    const [formState, setFormState] = useState<SettingsFormState>({
        timer: currentSettings,
        sound: currentSoundSettings
    });

    const [dirtyState, setDirtyState] = useState({
        timer: false,
        sound: false,
    });
    const isFormDirty = dirtyState.timer || dirtyState.sound;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormState({ timer: currentSettings, sound: currentSoundSettings });
            setDirtyState({ timer: false, sound: false });
            setShowSavedConfirmation(false);
        }
    }, [isOpen, currentSettings, currentSoundSettings]);

    useEffect(() => {
        if (showSavedConfirmation) {
            const timerId = setTimeout(() => setShowSavedConfirmation(false), 2000);
            return () => clearTimeout(timerId);
        }
    }, [showSavedConfirmation]);

    // --- Handler untuk Perubahan Input ---
    const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            timer: {
                ...prev.timer,
                [name]: parseInt(value, 10) || 0
            }
        }));
        setDirtyState(prev => ({ ...prev, timer: true }));
    };

    const handleSoundChange = (newSoundSettings: Partial<SettingsFormState['sound']>) => {
        setFormState(prev => ({ ...prev, sound: { ...prev.sound, ...newSoundSettings } }));
        setDirtyState(prev => ({ ...prev, sound: true }));
    };

    // --- Handler untuk Tombol SAVE ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormDirty || isSubmitting) return;

        setIsSubmitting(true);

        updateSettings(formState.timer);
        updateSoundSettings(formState.sound);

        const isCurrentlyRunning = useTimerStore.getState().isRunning;

        if (!isCurrentlyRunning) {
            resetTimerForUpdate();
        }

        setIsSubmitting(false);
        setDirtyState({ timer: false, sound: false });
        setShowSavedConfirmation(true);
    };

    const tabCategories = ['Timer', 'Sound'];

    // Helper class untuk input agar konsisten
    const inputStyles = "w-full rounded-md border-[var(--border-color)] bg-black/5 dark:bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent] disabled:opacity-50";

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="⚙️ Settings">
            <form onSubmit={handleSubmit} className="w-full">
                <Tab.Group>
                    <Tab.List
                        className="flex space-x-1 rounded-lg bg-black/5 dark:bg-white/5 p-1">
                        {tabCategories.map((category) => (
                            <Tab key={category} as={Fragment}>
                                {({ selected }) => (
                                    <button
                                        className="relative w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-200 focus:outline-none"
                                    >
                                        <span className={selected ? 'text-[--text]' : 'text-[--comment] hover:text-[--text]'}>
                                            {category}
                                        </span>
                                        {selected && (
                                            <motion.div
                                                className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-lg"
                                                layoutId="active-tab-highlight-settings"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                )}
                            </Tab>
                        ))}
                    </Tab.List>

                    <Tab.Panels className="mt-2 min-h-[180px]">
                        <Tab.Panel className="rounded-xl p-3 focus:outline-none">
                            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <div className="space-y-1">
                                    <label htmlFor="focus" className="block text-sm font-medium text-[--comment]">
                                        Focus (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        id="focus"
                                        name="focus"
                                        value={formState.timer.focus}
                                        onChange={handleTimerChange}
                                        min="1"
                                        disabled={isSubmitting}
                                        className={inputStyles}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="shortBreak" className="block text-sm font-medium text-[--comment]">
                                        Short Break
                                    </label>
                                    <input
                                        type="number"
                                        id="shortBreak"
                                        name="shortBreak"
                                        value={formState.timer.shortBreak}
                                        onChange={handleTimerChange}
                                        min="1"
                                        disabled={isSubmitting}
                                        className={inputStyles}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="longBreak" className="block text-sm font-medium text-[--comment]">
                                        Long Break
                                    </label>
                                    <input
                                        type="number"
                                        id="longBreak"
                                        name="longBreak"
                                        value={formState.timer.longBreak}
                                        onChange={handleTimerChange}
                                        min="1"
                                        disabled={isSubmitting}
                                        className={inputStyles}
                                    />
                                </div>
                            </div>
                        </Tab.Panel>

                        <Tab.Panel className="rounded-xl p-3 focus:outline-none">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="sound-toggle"
                                        className="text-sm font-medium text-[--comment]"
                                    >
                                        Enable Sounds
                                    </label>
                                    <button
                                        id="sound-toggle"
                                        type="button"
                                        role="switch"
                                        aria-checked={formState.sound.enabled}
                                        onClick={() => handleSoundChange({ enabled: !formState.sound.enabled })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border transition-all duration-200 ease-in-out ${formState.sound.enabled
                                                ? 'bg-[--accent] border-[--accent]'
                                                : 'border-[var(--border-color)] bg-black/10 dark:bg-white/5 dark:border-white/20 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ease-in-out ${formState.sound.enabled
                                                    ? 'translate-x-[23px] bg-[var(--text)]'
                                                    : 'translate-x-[3px] bg-[var(--text)] dark:bg-white'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <Listbox
                                    value={formState.sound.ambientSound}
                                    onChange={(value) => handleSoundChange({ ambientSound: value })}
                                    disabled={!formState.sound.enabled}
                                >
                                    <div className="relative">
                                        <Listbox.Label className={`block text-sm font-medium transition-opacity ${formState.sound.enabled ? 'text-[--comment]' : 'text-[--comment] opacity-50'
                                            }`}>
                                            Focus Ambient Sound
                                        </Listbox.Label>
                                        <Listbox.Button
                                            className={`relative mt-1 w-full cursor-default rounded-md border py-2 pl-3 pr-10 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] ${formState.sound.enabled
                                                ? 'border-[var(--border-color)] bg-black/5 dark:bg-white/5 text-[--text] focus-visible:border-[--accent]'
                                                : 'border-transparent bg-black/5 dark:bg-white/5 text-[--comment] opacity-50 cursor-not-allowed'
                                                }`}>
                                            <span className="block truncate capitalize">{formState.sound.ambientSound}</span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[--comment]">
                                                    <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06.04l2.7 2.92 2.7-2.92a.75.75 0 111.12 1.004l-3.25 3.5a.75.75 0 01-1.12 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </Listbox.Button>
                                        <AnimatePresence>
                                            {formState.sound.enabled && (
                                                <Listbox.Options as={motion.ul}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--bg-subtle)] py-1 text-base shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none sm:text-sm z-10"
                                                >
                                                    {ambientSoundsList.map((sound) => (
                                                        <Listbox.Option
                                                            key={sound}
                                                            className={({ active }) =>
                                                                `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? 'bg-[--accent]/20 text-[--accent]' : 'text-[--text]'
                                                                }`
                                                            }
                                                            value={sound}
                                                        >
                                                            <span className="block truncate capitalize">{sound}</span>
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </Listbox>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                <div
                    className="flex items-center justify-end pt-4 mt-4 border-t border-[var(--border-color)]">
                    <div className="flex-1 mr-4 h-5 flex items-center">
                        <AnimatePresence>
                            {showSavedConfirmation && (
                                <motion.p
                                    key="success-message"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center gap-2 text-xs text-[--success]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                    </svg>
                                    <span>Settings saved successfully.</span>
                                </motion.p>
                            )}
                            {isTimerRunning && dirtyState.timer && !showSavedConfirmation && (
                                <motion.p
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="text-xs text-[--comment]">
                                    Timer duration changes will apply next session.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormDirty || isSubmitting}
                        className={`flex items-center justify-center gap-2 w-36 rounded-md px-4 py-2 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed
        ${isSubmitting
                                ? 'bg-black/10 dark:bg-white/10 text-[--comment] opacity-100'
                                : showSavedConfirmation
                                    ? 'bg-[--success] text-white'
                                    : isFormDirty
                                        ? 'bg-[--accent] text-[--bg] hover:opacity-90'
                                        : 'bg-black/10 dark:bg-white/10 text-[--comment] opacity-50'
                            }
    `}
                    >
                        {isSubmitting ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                                <span>Saving...</span>
                            </>
                        ) : showSavedConfirmation ? (
                            <>
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                </motion.svg>
                                <span>Saved!</span>
                            </>
                        ) : (
                            'Save & Apply'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};