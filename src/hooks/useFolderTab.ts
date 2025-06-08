import { useEffect, useState } from "react";
import type { Folder } from "../interfaces";
import { useFlashcardStore } from "../store/flashcardStore";
import { useFolderTabStore } from "../store/folderTabStore";
import type { TabType } from "../types/tabs";

export const useFolderTab = (
  selectedFolderId: string | null,
  selectedFolder: Folder | undefined,
  folders: Folder[]
) => {
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const getFolderTab = useFolderTabStore((state) => state.getFolderTab);
  const setFolderTab = useFolderTabStore((state) => state.setFolderTab);

  // Handle tab switching when folder changes
  useEffect(() => {
    if (selectedFolder && selectedFolderId) {
      const hasSubfolders = folders.some(
        (f) => f.parentId === selectedFolderId
      );
      const hasNotes = selectedFolder.note
        ? selectedFolder.note.trim().length > 0
        : false;
      const hasFlashcards = useFlashcardStore
        .getState()
        .flashcards.some((f) => f.folderId === selectedFolderId);

      // Try to get the saved tab for this folder
      const savedTab = getFolderTab(selectedFolderId);

      // Check if saved tab is available
      const isSavedTabAvailable =
        (savedTab === "content" && hasSubfolders) ||
        (savedTab === "notes" && hasNotes) ||
        (savedTab === "flashcards" && hasFlashcards);

      if (isSavedTabAvailable) {
        setActiveTab(savedTab);
      } else {
        // If saved tab is not available, switch to an available one
        if (hasSubfolders) {
          setActiveTab("content");
        } else if (hasNotes) {
          setActiveTab("notes");
        } else if (hasFlashcards) {
          setActiveTab("flashcards");
        } else {
          setActiveTab("notes"); // Default to notes tab for empty folders
        }
      }
    }
  }, [selectedFolderId, folders, getFolderTab, selectedFolder]);

  // Save active tab when it changes
  useEffect(() => {
    if (selectedFolderId) {
      setFolderTab(selectedFolderId, activeTab);
    }
  }, [activeTab, selectedFolderId, setFolderTab]);

  return {
    activeTab,
    setActiveTab,
  };
};
