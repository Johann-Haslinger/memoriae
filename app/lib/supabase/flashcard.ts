import { Flashcard, FolderId } from "../../interfaces";

export const SupabaseFlashcardManager = {
  addFlashcard: async (flashcard: Flashcard) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(flashcard);
      }, 1000);
    });
  },
  fetchFlashcardsByFolder: async (folderId: FolderId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, question: "What is React?", answer: "A JavaScript library for building user interfaces", folderId },
          { id: 2, question: "What is Supabase?", answer: "An open-source Firebase alternative", folderId },
        ]);
      }, 1000);
    });
  },
  updateFlashcard: async (flashcard: Flashcard) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(flashcard);
      }, 1000);
    });
  },
  deleteFlashcard: async (flashcardId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(flashcardId);
      }, 1000);
    });
  },
  fetchFlashcardById: async (flashcardId: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: flashcardId,
          question: "What is React?",
          answer: "A JavaScript library for building user interfaces",
        });
      }, 1000);
    });
  },
};
