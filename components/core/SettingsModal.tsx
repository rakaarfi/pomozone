// components/core/SettingsModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useTimerStore } from '../../store/timerStore';

// Tipe untuk menampung nilai form
interface FormState {
    focus: number;
    shortBreak: number;
    longBreak: number;
}

export const SettingsModal = () => {
    // Ambil state dan aksi dari Zustand
    const isOpen = useTimerStore((state) => state.isSettingsModalOpen);
    const closeModal = useTimerStore((state) => state.closeSettingsModal);
    const updateSettings = useTimerStore((state) => state.updateSettings);
    const currentSettings = useTimerStore((state) => state.settings);

    const [formState, setFormState] = useState<FormState>(currentSettings);

    // Sinkronkan form dengan state global jika modal terbuka
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
        updateSettings(formState); // Gunakan aksi dari store
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="⚙️ Timer Settings">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Input untuk Focus Time */}
                    <div>
                        <label htmlFor="focus" className="block text-sm font-medium text-[--comment]">
                            Focus (minutes)
                        </label>
                        <input
                            type="number"
                            id="focus"
                            name="focus"
                            value={formState.focus}
                            onChange={handleInputChange}
                            min="1"
                            className="mt-1 w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                        />
                    </div>
                    {/* Input untuk Short Break */}
                    <div>
                        <label htmlFor="shortBreak" className="block text-sm font-medium text-[--comment]">
                            Short Break
                        </label>
                        <input
                            type="number"
                            id="shortBreak"
                            name="shortBreak"
                            value={formState.shortBreak}
                            onChange={handleInputChange}
                            min="1"
                            className="mt-1 w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                        />
                    </div>
                    {/* Input untuk Long Break */}
                    <div>
                        <label htmlFor="longBreak" className="block text-sm font-medium text-[--comment]">
                            Long Break
                        </label>
                        <input
                            type="number"
                            id="longBreak"
                            name="longBreak"
                            value={formState.longBreak}
                            onChange={handleInputChange}
                            min="1"
                            className="mt-1 w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                        />
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="rounded-md bg-[--accent] px-6 py-2 text-sm font-bold text-[--bg] transition-opacity hover:opacity-90"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};