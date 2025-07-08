// components/core/ChallengeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useTimerStore } from '../../store/timerStore';
import challenges from '../../lib/challenges.json';

interface Challenge {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export const ChallengeModal = () => {
    const isOpen = useTimerStore((state) => state.isChallengeModalOpen);
    const closeModal = useTimerStore((state) => state.closeChallengeModal);

    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Pilih challenge acak saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            const randomIndex = Math.floor(Math.random() * challenges.length);
            setSelectedChallenge(challenges[randomIndex]);
            setSelectedAnswer(null);
            setIsAnswered(false);
        }
    }, [isOpen]);

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);
    };

    if (!selectedChallenge) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="🧠 Mini Challenge">
            <div>
                <p className="mb-4 text-[--text]">{selectedChallenge.question}</p>
                <div className="space-y-2">
                    {selectedChallenge.options.map((option) => {
                        const isCorrect = option === selectedChallenge.answer;
                        const isSelected = option === selectedAnswer;

                        let buttonStyle = 'bg-white/5 hover:bg-white/10';
                        if (isAnswered) {
                            if (isCorrect) {
                                buttonStyle = 'bg-green-500/20 text-[--success]';
                            } else if (isSelected) {
                                buttonStyle = 'bg-red-500/20 text-[--error]';
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`w-full rounded-md p-3 text-left transition-colors ${buttonStyle}`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4">
                        <p className="font-bold text-[--accent]">Explanation:</p>
                        <p className="text-[--comment]">{selectedChallenge.explanation}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};