import { create } from "zustand";
import type { TabType } from "../types/tabs";

interface FolderTabState {
  folderTabs: Record<string, TabType>;
  setFolderTab: (folderId: string, tab: TabType) => void;
  getFolderTab: (folderId: string) => TabType | undefined;
}

// Load initial state from localStorage
const loadInitialState = (): Record<string, TabType> => {
  if (typeof window === "undefined") return {};
  const savedTabs = localStorage.getItem("folderTabs");
  return savedTabs ? JSON.parse(savedTabs) : {};
};

export const useFolderTabStore = create<FolderTabState>((set, get) => ({
  folderTabs: loadInitialState(),
  setFolderTab: (folderId: string, tab: TabType) => {
    set((state) => {
      const newState = {
        ...state,
        folderTabs: {
          ...state.folderTabs,
          [folderId]: tab,
        },
      };
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("folderTabs", JSON.stringify(newState.folderTabs));
      }
      return newState;
    });
  },
  getFolderTab: (folderId: string) => {
    return get().folderTabs[folderId];
  },
}));
