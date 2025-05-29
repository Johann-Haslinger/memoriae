import { Bot, Brain, FileText, Folder, Plus } from "lucide-react";
import React, { useState } from "react";
import { useFlashcardStore } from "../store/flashcardStore";
import { useFolderStore } from "../store/folderStore";
import type { Tab, TabType } from "../types/tabs";
import AddFolderButton from "./AddFolderButton";
import TabContextMenu from "./TabContextMenu";

interface ContentTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedFolderId: string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
  selectedFolderId,
}) => {
  const folders = useFolderStore((state) => state.folders);
  const flashcards = useFlashcardStore((state) => state.flashcards);
  const [showContextMenu, setShowContextMenu] = useState(false);
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

  const allTabs: Tab[] = [
    {
      id: "content" as TabType,
      label: "Content",
      show: hasSubfolders,
      icon: Folder,
      iconColor: "text-blue-400",
    },
    {
      id: "notes" as TabType,
      label: "Notes",
      show: hasNotes,
      icon: FileText,
      iconColor: "text-green-400",
    },
    {
      id: "flashcards" as TabType,
      label: "Flashcards",
      show: hasFlashcards,
      icon: Brain,
      iconColor: "text-purple-400",
    },
    {
      id: "quizzes" as TabType,
      label: "AI Quiz",
      show: false,
      icon: Bot,
      iconColor: "text-orange-400",
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
    <div className="w-full mt-4 mb-6">
      <div className="flex items-center justify-between">
        <nav
          className="flex items-center space-x-1"
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
                <tab.icon className={`size-4`} />
                {tab.label}
              </button>
            );
          })}
          {hiddenTabs.length > 0 && (
            <button
              onClick={handleAddTabClick}
              className="p-2 text-white/50 hover:text-white/70 rounded-lg hover:bg-white/10 transition-colors"
              title="Add new tab"
              aria-label="Add new tab"
            >
              <Plus className="size-4" />
            </button>
          )}
        </nav>
        <AddFolderButton parentId={selectedFolderId} activeTab={activeTab} />
      </div>
      {showContextMenu && (
        <TabContextMenu
          availableTabs={hiddenTabs}
          onSelect={handleTabSelect}
          onClose={() => setShowContextMenu(false)}
          position={contextMenuPosition}
        />
      )}
    </div>
  );
};

export default ContentTabs;
