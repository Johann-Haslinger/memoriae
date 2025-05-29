import { create } from "zustand";
import type { Folder } from "../interfaces";

const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Mathematics",
    type: "subject",
    note: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    icon: "📚",
    coverImage:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NDgwNDl8MHwxfHNlYXJjaHw3fHxNYXRofGVufDB8MHx8fDE3NDg1MDcwNTh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "2",
    name: "Algebra",
    type: "folder",
    parentId: "1",
    note: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    icon: "➗",
    coverImage: undefined,
  },
  {
    id: "3",
    name: "Geometry",
    type: "folder",
    parentId: "1",
    icon: "📐",
    coverImage:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    name: "History",
    type: "subject",
    icon: "🏛️",
    coverImage: undefined,
  },
  {
    id: "5",
    name: "World War II",
    type: "folder",
    parentId: "4",
    note: "Notes about WWII.",
    icon: "⚔️",
    coverImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    name: "Biology",
    type: "subject",
    icon: "🧬",
    coverImage: undefined,
  },
];

interface FolderState {
  folders: Folder[];
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  updateFolder: (id: string, updatedFields: Partial<Folder>) => void;
  setFolders: (folders: Folder[]) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
}

export const useFolderStore = create<FolderState>((set) => ({
  folders: mockFolders,
  addFolder: (folder) =>
    set((state) => ({
      folders: [...state.folders, folder],
    })),
  removeFolder: (id) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),
  updateFolder: (id, updatedFields) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updatedFields } : folder
      ),
    })),
  setFolders: (folders) => set(() => ({ folders })),
  selectedFolderId: "1",
  setSelectedFolderId: (id) => set(() => ({ selectedFolderId: id })),
}));
