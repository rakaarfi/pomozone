// components/core/CheckpointModal.tsx
'use client';

import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useTimerStore } from '../../store/timerStore';

export const CheckpointModal = () => {
    // Ambil state dan aksi dari store secara individual
    const isOpen = useTimerStore((state) => state.isCheckpointModalOpen);
    const closeModal = useTimerStore((state) => state.closeCheckpointModal);
    const addCheckpoint = useTimerStore((state) => state.addCheckpoint);

    // State lokal untuk input form
    const [commitMessage, setCommitMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commitMessage.trim()) {
            addCheckpoint(commitMessage.trim());
            setCommitMessage(''); // Kosongkan input setelah submit
            closeModal();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="✍️ Create Checkpoint">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="commit-message" className="block text-sm font-medium text-[--comment]">
                        git commit -m &quot;<span className="text-[--text]">{commitMessage || 'Your summary...'}</span>&quot;
                    </label>
                    <div className="mt-1">
                        <input
                            id="commit-message"
                            type="text"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            placeholder="e.g., Finished dashboard layout & login validation"
                            className="w-full rounded-md border-white/10 bg-white/5 p-2 text-[--text] focus:border-[--accent] focus:ring-[--accent]"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="rounded-md bg-[--accent] px-4 py-2 text-sm font-bold text-[--bg] transition-opacity hover:opacity-90 disabled:opacity-50"
                        disabled={!commitMessage.trim()}
                    >
                        Commit
                    </button>
                </div>
            </form>
        </Modal>
    );
};