// components/core/PwaRegistry.tsx
'use client';

import { useEffect } from 'react';

export const PwaRegistry = () => {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            process.env.NODE_ENV === 'production'
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
    }, []);

    return null;
};