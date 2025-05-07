export type FlashcardId = string;

export interface Flashcard {
  id: FlashcardId;
  question: string;
  answer: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
  nextReview: Date;
  isDeleted: boolean;
}
