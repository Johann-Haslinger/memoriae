import { Bot, Brain, FileText, Folder, Play, Plus } from "lucide-react";
import React, { useState } from "react";
import { useFlashcardStore } from "../store/flashcardStore";
import { useFolderStore } from "../store/folderStore";
import type { Tab, TabType } from "../types/tabs";
import AddFolderButton from "./AddFolderButton";
import { Button } from "./Button";
import FlashcardReview from "./FlashcardReview";
import TabContextMenu from "./TabContextMenu";

interface ContentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedFolderId: string;
  onAddFlashcard?: () => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
  selectedFolderId,
  onAddFlashcard,
}) => {
  const folders = useFolderStore((state) => state.folders);
  const flashcards = useFlashcardStore((state) => state.flashcards);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const hasSubfolders = folders.some((f) => f.parentId === selectedFolderId);
  const hasNotes = selectedFolder?.note
    ? selectedFolder.note.trim().length > 0
    : false;
  const hasFlashcards = flashcards.some((f) => f.folderId === selectedFolderId);

  const folderFlashcards = flashcards.filter(
    (f) => f.folderId === selectedFolderId
  );

  const allTabs: Tab[] = [
    {
      id: "content" as TabType,
      label: "Content",
      show: hasSubfolders,
      icon: Folder,
      iconColor: "text-[#27ae60]/80",
    },
    {
      id: "notes" as TabType,
      label: "Notes",
      show: hasNotes,
      icon: FileText,
      iconColor: "text-[#2980b9]/80",
    },
    {
      id: "flashcards" as TabType,
      label: "Flashcards",
      show: hasFlashcards,
      icon: Brain,
      iconColor: "text-[#8e44ad]/80",
    },
    {
      id: "quizzes" as TabType,
      label: "AI Quiz",
      show: false,
      icon: Bot,
      iconColor: "text-[#e67e22]/80",
    },
  ];

  const availableTabs: Tab[] = allTabs.filter((tab) => tab.show);
  const hiddenTabs: Tab[] = allTabs.filter((tab) => !tab.show);

  // If no tabs are available, show at least the content tab
  if (availableTabs.length === 0) {
    availableTabs.push({
      id: "content",
      label: "Content",
      show: true,
      icon: Folder,
      iconColor: "text-blue-400",
    });
  }

  const handleAddTabClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: rect.left,
      y: rect.bottom + 5,
    });
    setShowContextMenu(true);
  };

  const handleTabSelect = (tabId: TabType) => {
    onTabChange(tabId);
    setShowContextMenu(false);
  };

  return (
    <div className="w-full mt-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {hiddenTabs.length > 0 && (
            <button
              onClick={handleAddTabClick}
              className="p-2 text-white/50 hover:text-white/70 rounded-full hover:bg-white/10 bg-white/5 transition-colors"
              title="Add new tab"
              aria-label="Add new tab"
            >
              <Plus className="size-4" />
            </button>
          )}
          <nav
            className="flex items-center space-x-2"
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
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full
                    transition-colors duration-150 ease-in-out
                    ${
                      isActive
                        ? `bg-white/5 text-[#FFFFFFCF]`
                        : "text-white/50 hover:text-white/70 hover:bg-white/10"
                    }
                  `}
                >
                  <tab.icon className={`size-4 ${tab.iconColor}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div>
          {activeTab === "flashcards" && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddFlashcard}
                className="flex items-center gap-2 text-white/50 hover:text-white/70"
              >
                <Plus className="w-4 h-4" />
                Add Flashcard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReview(true)}
                className="flex items-center gap-2 text-white/50 hover:text-white/70"
              >
                <Play className="w-4 h-4" />
                Review Flashcards
              </Button>
            </div>
          )}
          <AddFolderButton parentId={selectedFolderId} activeTab={activeTab} />
        </div>
      </div>
      {showContextMenu && (
        <TabContextMenu
          availableTabs={hiddenTabs}
          onSelect={handleTabSelect}
          onClose={() => setShowContextMenu(false)}
          position={contextMenuPosition}
        />
      )}
      {showReview && (
        <FlashcardReview
          flashcards={folderFlashcards}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
};

export default ContentTabs;
