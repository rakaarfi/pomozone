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
        // Backdrop - Perubahan di sini!
        <div
            // 1. Gelapkan backdrop dari 60% menjadi 75%
            // 2. Perkuat blur dari 'sm' menjadi 'md'
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md"
            onClick={onClose}
        >
            {/* Konten Modal - Perubahan di sini! */}
            <div
                // 3. Beri background semi-opaque. 
                //    Gunakan warna yang sedikit berbeda dari background utama + opacity 80%.
                //    Ini akan "memblokir" teks di belakangnya dengan efektif.
                className="relative w-full max-w-lg rounded-lg bg-[#161b22]/80 p-6 shadow-2xl ring-1 ring-white/20"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    {/* Tambahkan ikon otak untuk sentuhan visual */}
                    <h2 className="flex items-center gap-2 text-lg font-bold text-[--text]">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-[--comment] hover:text-[--text] text-2xl leading-none">
                        ×
                    </button>
                </div>

                {/* Body Modal */}
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};