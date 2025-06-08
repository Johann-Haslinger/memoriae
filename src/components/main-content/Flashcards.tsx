import { MoreVertical } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useFlashcardStore } from "../../store/flashcardStore";
import { Button } from "../Button";

interface FlashcardsProps {
  selectedFolderId: string;
}

const Flashcards: React.FC<FlashcardsProps> = ({ selectedFolderId }) => {
  const getFlashcardsByFolder = useFlashcardStore(
    (state) => state.getFlashcardsByFolder
  );
  const deleteFlashcard = useFlashcardStore((state) => state.deleteFlashcard);
  const flashcards = useMemo(
    () => getFlashcardsByFolder(selectedFolderId),
    [getFlashcardsByFolder, selectedFolderId]
  );
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteFlashcard(id);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcards.map((flashcard) => (
          <div
            key={flashcard.id}
            className="dark:bg-[#212020] rounded-lg p-4 hover:bg-white/10 transition-colors relative group h-[160px]"
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto text-white/50 hover:text-white/70"
                onClick={() =>
                  setActiveMenuId(
                    activeMenuId === flashcard.id ? null : flashcard.id
                  )
                }
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              {activeMenuId === flashcard.id && (
                <div className="absolute right-0 mt-1 w-48 bg-gray-900 rounded-md shadow-lg border border-gray-800 py-1 z-10">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      setActiveMenuId(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-white/10"
                    onClick={() => handleDelete(flashcard.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="h-full flex flex-col">
              <p className="font-semibold text-white/90 mb-2 line-clamp-2">
                {flashcard.question}
              </p>
              <p className="text-white/60 font-medium line-clamp-3">
                {flashcard.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flashcards;
