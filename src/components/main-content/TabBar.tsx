import React from "react";
import { useFlashcardStore } from "../store/flashcardStore";
import { useFolderStore } from "../store/folderStore";

export type TabType = "notes" | "flashcards" | "quizzes" | "content";

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedFolderId: string;
  onAddTab: () => void;
}

const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  selectedFolderId,
  onAddTab,
}) => {
  const folders = useFolderStore((state) => state.folders);
  const flashcards = useFlashcardStore((state) => state.flashcards);

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const hasSubfolders = folders.some((f) => f.parentId === selectedFolderId);
  const hasNotes = selectedFolder?.note
    ? selectedFolder.note.trim().length > 0
    : false;
  const hasFlashcards = flashcards.some((f) => f.folderId === selectedFolderId);

  const availableTabs = [
    {
      id: "content" as TabType,
      label: "Content",
      show: hasSubfolders,
      emoji: "📁",
      bgColor: "bg-blue-400/5",
    },
    {
      id: "notes" as TabType,
      label: "Notes",
      show: hasNotes,
      emoji: "📝",
      bgColor: "bg-green-400/5",
    },
    {
      id: "flashcards" as TabType,
      label: "Flashcards",
      show: hasFlashcards,
      emoji: "🧠",
      bgColor: "bg-purple-400/5",
    },
    {
      id: "quizzes" as TabType,
      label: "AI Quiz",
      show: true,
      emoji: "🤖",
      bgColor: "bg-orange-400/5",
    },
  ].filter((tab) => tab.show);

  // If no tabs are available, show at least the content tab
  if (availableTabs.length === 0) {
    availableTabs.push({
      id: "content",
      label: "Content",
      show: true,
      emoji: "📁",
      bgColor: "bg-blue-400/5",
    });
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 overflow-x-auto">
          <nav
            className="flex space-x-1"
            role="tablist"
            aria-label="Content tabs"
          >
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md
                    transition-colors duration-150 ease-in-out
                    ${
                      isActive
                        ? `${tab.bgColor} text-[#FFFFFFCF]`
                        : "text-white/50 hover:text-white/70 hover:bg-white/5"
                    }
                  `}
                >
                  <span className="text-base">{tab.emoji}</span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={onAddTab}
          className="ml-2 p-2 text-white/50 hover:text-white/70 rounded-md hover:bg-white/5 transition-colors"
          title="Add new tab"
          aria-label="Add new tab"
        >
          <span className="text-base">➕</span>
        </button>
      </div>
    </div>
  );
};

export default TabBar;
