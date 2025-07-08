// components/core/PwaRegistry.tsx
'use client';

import { useEffect } from 'react';

export const PwaRegistry = () => {
    useEffect(() => {
        // Pastikan kita berada di browser dan service worker didukung
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            process.env.NODE_ENV === 'production' // Hanya jalankan di mode produksi
        ) {
            console.log('Attempting to register service worker...');

            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch((err) => {
                    console.error('Service Worker registration failed:', err);
                });
        } else {
            if (process.env.NODE_ENV !== 'production') {
                console.log('PWA registration skipped in development mode.');
            } else {
                console.log('Service Worker not supported by this browser.');
            }
        }
    }, []); // Jalankan hanya sekali saat komponen dimuat

    // Komponen ini tidak me-render apa pun ke UI
    return null;
};