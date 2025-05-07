import { create } from "zustand";
import { Folder, FolderId } from "../interfaces";

interface FolderStore {
  folders: Folder[];
  addFolder: (folder: Folder) => void;
  removeFolder: (folderId: FolderId) => void;
  updateFolder: (folderId: FolderId, updatedFolder: Partial<Folder>) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folders: [],
  addFolder: (folder: Folder) => set((state: FolderStore) => ({ folders: [...state.folders, folder] })),
  removeFolder: (folderId: FolderId) =>
    set((state: FolderStore) => ({ folders: state.folders.filter((folder: Folder) => folder.id !== folderId) })),
  updateFolder: (folderId: FolderId, updatedFolder: Partial<Folder>) =>
    set((state: FolderStore) => ({
      folders: state.folders.map((folder: Folder) =>
        folder.id === folderId ? { ...folder, ...updatedFolder } : folder
      ),
    })),
}));
