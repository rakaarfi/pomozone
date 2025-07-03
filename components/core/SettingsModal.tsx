// components/core/SettingsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useTimerStore } from '../../store/timerStore';
import { ambientSounds, type AmbientSound } from '../../lib/audioManager';
import { Listbox } from '@headlessui/react'; // <-- Impor Listbox dari Headless UI
import { motion, AnimatePresence } from 'framer-motion'; // <-- Impor untuk animasi/

interface FormState {
    focus: number;
    shortBreak: number;
    longBreak: number;
}

export const SettingsModal = () => {
    const isOpen = useTimerStore((state) => state.isSettingsModalOpen);
    const closeModal = useTimerStore((state) => state.closeSettingsModal);
    const updateSettings = useTimerStore((state) => state.updateSettings);
    const currentSettings = useTimerStore((state) => state.settings);
    const soundSettings = useTimerStore((state) => state.soundSettings);
    const updateSoundSettings = useTimerStore((state) => state.updateSoundSettings);

    const [formState, setFormState] = useState<FormState>(currentSettings);

    useEffect(() => {
        if (isOpen) {
            setFormState(currentSettings);
        }
    }, [isOpen, currentSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: parseInt(value, 10) || 0,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings(formState);
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="⚙️ Timer & Sound Settings">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* --- BAGIAN TIMER DURATIONS (DIPERBAIKI) --- */}
                <div>
                    <p className="text-lg font-semibold text-[--text]">Timer Durations</p>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                        {/* Grup 1: Focus */}
                        <div className="space-y-1">
                            <label htmlFor="focus" className="block text-sm font-medium text-[--comment]">
                                Focus (minutes)
                            </label>
                            <input
                                type="number" id="focus" name="focus" value={formState.focus}
                                onChange={handleInputChange} min="1"
                                className="w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                            />
                        </div>
                        {/* Grup 2: Short Break */}
                        <div className="space-y-1">
                            <label htmlFor="shortBreak" className="block text-sm font-medium text-[--comment]">
                                Short Break
                            </label>
                            <input
                                type="number" id="shortBreak" name="shortBreak" value={formState.shortBreak}
                                onChange={handleInputChange} min="1"
                                className="w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                            />
                        </div>
                        {/* Grup 3: Long Break */}
                        <div className="space-y-1">
                            <label htmlFor="longBreak" className="block text-sm font-medium text-[--comment]">
                                Long Break
                            </label>
                            <input
                                type="number" id="longBreak" name="longBreak" value={formState.longBreak}
                                onChange={handleInputChange} min="1"
                                className="w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-white/10" />

                {/* --- BAGIAN SOUND --- */}
                <div>
                    <p className="text-lg font-semibold text-[--text]">Sound</p>
                    <div className="mt-4 space-y-4">
                        {/* Toggle Switch dengan Tema App - DIPERBAIKI */}
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
                                aria-checked={soundSettings.enabled}
                                onClick={() => updateSoundSettings({ enabled: !soundSettings.enabled })}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full border transition-all duration-200 ease-in-out ${
                                    soundSettings.enabled 
                                        ? 'bg-[--accent] border-[--accent]' 
                                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                                }`}
                            >
                                {/* Lingkaran Kenop */}
                                <span
                                    className={`${
                                        soundSettings.enabled ? 'translate-x-[23px]' : 'translate-x-[3px]'
                                    } inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out`}
                                />
                            </button>
                        </div>

                        {/* Dropdown Kustom dengan Headless UI */}
                        <Listbox
                            value={soundSettings.ambientSound}
                            onChange={(value) => updateSoundSettings({ ambientSound: value })}
                            disabled={!soundSettings.enabled}
                        >
                            <div className="relative">
                                <Listbox.Label className={`block text-sm font-medium transition-opacity ${
                                    soundSettings.enabled ? 'text-[--comment]' : 'text-[--comment] opacity-50'
                                }`}>
                                    Focus Ambient Sound
                                </Listbox.Label>
                                <Listbox.Button className={`relative mt-1 w-full cursor-default rounded-md border py-2 pl-3 pr-10 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent] ${
                                    soundSettings.enabled 
                                        ? 'border-white/10 bg-white/5 text-[--text] focus-visible:border-[--accent]' 
                                        : 'border-white/5 bg-white/5 text-[--comment] opacity-50 cursor-not-allowed'
                                }`}>
                                    <span className="block truncate capitalize">{soundSettings.ambientSound}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-[--comment]">
                                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06.04l2.7 2.92 2.7-2.92a.75.75 0 111.12 1.004l-3.25 3.5a.75.75 0 01-1.12 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                </Listbox.Button>
                                <AnimatePresence>
                                    {soundSettings.enabled && (
                                        <Listbox.Options as={motion.ul}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#161b22] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
                                        >
                                            {Object.keys(ambientSounds).map((sound) => (
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
                </div>

                {/* Tombol Save */}
                <div className="flex justify-end pt-4 border-t border-white/10">
                    <button
                        type="submit"
                        className="rounded-md bg-[--accent] px-6 py-2 text-sm font-bold text-[--bg] transition-opacity hover:opacity-90"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </Modal>
    );
};