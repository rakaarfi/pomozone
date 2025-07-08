// lib/audioManager.ts
import { Howl } from 'howler';

export const ambientSoundsList = ['keyboard', 'rain', 'library', 'none'] as const;
export type AmbientSound = typeof ambientSoundsList[number];

let currentSound: Howl | null = null;

const audioManager = {
    // Hanya DUA fungsi yang kita butuhkan: play dan stop.

    play: (soundName: AmbientSound, volume: number = 0.3) => {
        if (currentSound) {
            currentSound.stop();
            currentSound.unload();
            currentSound = null;
        }

        if (soundName === 'none') {
            return;
        }

        currentSound = new Howl({
            src: [`/sounds/${soundName}.mp3`],
            loop: true,
            html5: true,
            volume: 0,
        });

        currentSound.play();
        currentSound.fade(0, volume, 1000);
    },

    stop: () => {
        if (currentSound) {
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