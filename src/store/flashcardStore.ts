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
  flashcards: [],

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
