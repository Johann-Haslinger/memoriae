import { create } from "zustand";
import type { Flashcard } from "../interfaces/flashcard";

interface FlashcardState {
  flashcards: Flashcard[];
  addFlashcard: (
    flashcard: Omit<Flashcard, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateFlashcard: (
    id: string,
    updates: Partial<Omit<Flashcard, "id" | "createdAt" | "updatedAt">>
  ) => void;
  deleteFlashcard: (id: string) => void;
  getFlashcardsByFolder: (folderId: string) => Flashcard[];
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  flashcards: [
    {
      id: "fc1",
      folderId: "2", // Calculus in Math
      question: "What is the derivative of sin(x)?",
      answer: "cos(x)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fc2",
      folderId: "2", // Calculus in Math
      question: "What is the integral of 1/x dx?",
      answer: "ln|x| + C",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fc3",
      folderId: "2", // Calculus in Math
      question: "State the Fundamental Theorem of Calculus.",
      answer:
        "It links the concept of the derivative of a function with the concept of its integral.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fc4",
      folderId: "2", // Calculus in Math
      question: "What is the derivative of x^n (where n ≠ 0)?",
      answer: "n * x^(n-1)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fc5",
      folderId: "2", // Calculus in Math
      question: "What is the limit of (sin x)/x as x approaches 0?",
      answer: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "fc6",
      folderId: "2", // Calculus in Math
      question: "What is the integral of e^x dx?",
      answer: "e^x + C",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  addFlashcard: (flashcard) => {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      flashcards: [...state.flashcards, newFlashcard],
    }));
  },

  updateFlashcard: (id, updates) => {
    set((state) => ({
      flashcards: state.flashcards.map((flashcard) =>
        flashcard.id === id
          ? {
              ...flashcard,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : flashcard
      ),
    }));
  },

  deleteFlashcard: (id) => {
    set((state) => ({
      flashcards: state.flashcards.filter((flashcard) => flashcard.id !== id),
    }));
  },

  getFlashcardsByFolder: (folderId) => {
    return get().flashcards.filter(
      (flashcard) => flashcard.folderId === folderId
    );
  },
}));
