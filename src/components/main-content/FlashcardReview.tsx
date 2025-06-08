import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import React, { useState } from "react";
import type { Flashcard } from "../../interfaces/flashcard";
import { Button } from "../Button";

interface FlashcardReviewProps {
  flashcards: Flashcard[];
  onClose: () => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  flashcards,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>(() => {
    return [...flashcards].sort(() => Math.random() - 0.5);
  });

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setShuffledCards([...shuffledCards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (flashcards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#212020] rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-white/90 mb-4">
            No Flashcards
          </h2>
          <p className="text-white/70 mb-6">
            There are no flashcards to review in this folder.
          </p>
          <Button variant="default" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#212020] rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white/90">
            Review Flashcards
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShuffle}
              className="text-white/50 hover:text-white/70"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/50 hover:text-white/70"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] mb-6">
          <div
            className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="absolute inset-0 backface-hidden bg-white/5 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer">
              <p className="text-xl font-semibold text-white/90 text-center">
                {shuffledCards[currentIndex].question}
              </p>
              <p className="text-white/50 mt-2">Click to reveal answer</p>
            </div>
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white/5 rounded-lg p-6 flex flex-col justify-center items-center cursor-pointer">
              <p className="text-xl font-medium text-white/70 text-center">
                {shuffledCards[currentIndex].answer}
              </p>
              <p className="text-white/50 mt-2">Click to see question</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-white/50 hover:text-white/70 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-white/50">
            {currentIndex + 1} of {shuffledCards.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1}
            className="text-white/50 hover:text-white/70 disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardReview;
