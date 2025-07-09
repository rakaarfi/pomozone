// hooks/useNotifications.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// Tipe untuk status izin notifikasi
type NotificationPermission = 'default' | 'granted' | 'denied';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    // Cek status izin saat komponen pertama kali dimuat
    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    // Fungsi untuk meminta izin kepada pengguna
    const requestPermission = useCallback(async () => {
        if (!('Notification' in window)) {
            console.error('This browser does not support desktop notification');
            return;
        }

        if (permission !== 'granted') {
            const status = await Notification.requestPermission();
            setPermission(status);
        }
    }, [permission]);

    // Fungsi untuk mengirim notifikasi
    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (permission !== 'granted') {
            console.warn('Notification permission not granted.');
            return;
        }

        // Buat notifikasi baru
        const notification = new Notification(title, {
            ...options,
            icon: '/icons/icon-192x192.png', // Ikon default untuk notifikasi
            badge: '/favicon.ico', // Ikon kecil (biasanya di Android)
        });

        // (Opsional) Saat notifikasi diklik, fokus ke tab aplikasi
        notification.onclick = () => {
            window.focus();
        };

    }, [permission]);

    return { permission, requestPermission, sendNotification };
};