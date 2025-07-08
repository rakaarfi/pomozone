// components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg rounded-lg bg-[#161b22]/80 p-6 shadow-2xl ring-1 ring-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[--text]">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-[--comment] hover:text-[--text] text-2xl leading-none">
                        ×
                    </button>
                </div>

                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};