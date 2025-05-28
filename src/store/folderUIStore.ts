import { create } from "zustand";

type FolderUIState = {
  openFolders: Record<string, boolean>;
  toggleFolder: (id: string) => void;
  setFolderOpen: (id: string, isOpen: boolean) => void;
  resetOpenFolders: () => void;
};

export const useFolderUIStore = create<FolderUIState>((set) => ({
  openFolders: {},
  toggleFolder: (id: string) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [id]: !state.openFolders[id],
      },
    })),
  setFolderOpen: (id: string, isOpen: boolean) =>
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [id]: isOpen,
      },
    })),
  resetOpenFolders: () =>
    set(() => ({
      openFolders: {},
    })),
}));
