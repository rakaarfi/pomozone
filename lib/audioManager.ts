// lib/audioManager.ts
import { Howl } from 'howler';

export const ambientSoundsList = ['keyboard', 'rain', 'library', 'none'] as const;
export type AmbientSound = typeof ambientSoundsList[number];

// PENTING: Hanya satu variabel untuk melacak suara yang sedang aktif.
let currentSound: Howl | null = null;

const audioManager = {
    // Hanya DUA fungsi yang kita butuhkan: play dan stop.

    play: (soundName: AmbientSound, volume: number = 0.3) => {
        // 1. Hentikan dan hancurkan suara lama APAPUN yang sedang berjalan.
        // Ini adalah langkah paling penting yang kita lewatkan.
        if (currentSound) {
            currentSound.stop();
            currentSound.unload(); // Hapus dari memori untuk mencegah konflik
            currentSound = null;
        }

        // 2. Jika suara yang diminta adalah 'none', selesai.
        if (soundName === 'none') {
            return;
        }

        // 3. Buat objek Howl BARU dan mainkan.
        // Membuat ulang objek setiap saat itu tidak apa-apa dan lebih aman daripada mencoba mengelola bank.
        currentSound = new Howl({
            src: [`/sounds/${soundName}.mp3`], // Asumsi nama file sama dengan nama suara
            loop: true,
            html5: true,
            volume: 0, // Mulai dari 0 untuk fade in
        });

        currentSound.play();
        currentSound.fade(0, volume, 1000);
    },

    stop: () => {
        if (currentSound) {
            // Fade out lalu hancurkan.
            currentSound.fade(currentSound.volume(), 0, 500);
            currentSound.once('fade', () => {
                if (currentSound) {
                    currentSound.stop();
                    currentSound.unload();
                    currentSound = null;
                }
            });
        }
    },
};

export default audioManager;