// lib/audioManager.ts
import { Howl } from 'howler';

// Definisikan suara yang tersedia
export const ambientSounds = {
    keyboard: '/sounds/mecha-keyboard-creamy.mp3',
    rain: '/sounds/rain_medium_thunders.mp3',
    library: '/sounds/library-ambiance.mp3',
    // 'none' adalah opsi untuk tidak memutar apa pun
    none: 'none',
};

// Tipe untuk nama suara yang valid
export type AmbientSound = keyof typeof ambientSounds;

let currentAmbient: Howl | null = null;

const audioManager = {
    playAmbient: (soundName: AmbientSound) => {
        // Hentikan suara yang sedang berjalan jika ada
        audioManager.stopAmbient();

        if (soundName === 'none' || !ambientSounds[soundName]) {
            return;
        }

        // Buat dan mainkan suara baru
        currentAmbient = new Howl({
            src: [ambientSounds[soundName]],
            loop: true,
            volume: 0, // Mulai dengan volume 0
            html5: true, // Direkomendasikan untuk file panjang
        });

        currentAmbient.play();
        // Fade in ke volume target
        currentAmbient.fade(0, 0.3, 1000); // fade from volume 0 to 0.3 over 1 second
    },

    stopAmbient: () => {
        if (currentAmbient) {
            // Fade out lalu hentikan
            currentAmbient.fade(currentAmbient.volume(), 0, 500);
            currentAmbient.once('fade', () => {
                currentAmbient?.stop();
                currentAmbient = null;
            });
        }
    },

    // Nanti kita bisa tambahkan efek suara lain di sini
    // playEffect: (effectName: string) => { ... }
};

export default audioManager;