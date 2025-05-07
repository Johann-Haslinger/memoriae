import { create } from "zustand";
import { Flashcard, FlashcardId } from "../interfaces";

interface FlashcardStore {
  flashcards: Flashcard[];
  addFlashcard: (flashcard: Flashcard) => void;
  removeFlashcard: (flashcardId: FlashcardId) => void;
  updateFlashcard: (flashcardId: FlashcardId, updatedFlashcard: Partial<Flashcard>) => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  flashcards: [],
  addFlashcard: (flashcard: Flashcard) =>
    set((state: FlashcardStore) => ({ flashcards: [...state.flashcards, flashcard] })),
  removeFlashcard: (flashcardId: FlashcardId) =>
    set((state: FlashcardStore) => ({
      flashcards: state.flashcards.filter((flashcard: Flashcard) => flashcard.id !== flashcardId),
    })),
  updateFlashcard: (flashcardId: FlashcardId, updatedFlashcard: Partial<Flashcard>) =>
    set((state: FlashcardStore) => ({
      flashcards: state.flashcards.map((flashcard: Flashcard) =>
        flashcard.id === flashcardId ? { ...flashcard, ...updatedFlashcard } : flashcard
      ),
    })),
}));
