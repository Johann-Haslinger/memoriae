import { create } from "zustand";
import type { Folder } from "../interfaces";

const LOREM_NOTE =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Mathematics",
    type: "subject",
    note:
      "Core mathematics curriculum covering algebra, calculus, and statistics\n\n" +
      LOREM_NOTE,
    icon: "🧮",
    coverImage:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NDgwNDl8MHwxfHNlYXJjaHw3fHxNYXRofGVufDB8MHx8fDE3NDg1MDcwNTh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    id: "2",
    name: "Calculus",
    type: "folder",
    parentId: "1",
    note: "Differential and integral calculus concepts\n\n" + LOREM_NOTE,
    icon: "📊",
    coverImage: undefined,
  },
  {
    id: "3",
    name: "Derivatives",
    type: "folder",
    parentId: "2",
    note: "Understanding derivatives and their applications\n\n" + LOREM_NOTE,
    icon: "📈",
    coverImage: undefined,
  },
  {
    id: "4",
    name: "Integration",
    type: "folder",
    parentId: "2",
    note: "Integration techniques and applications\n\n" + LOREM_NOTE,
    icon: "📉",
    coverImage: undefined,
  },
  {
    id: "14",
    name: "Algebra",
    type: "folder",
    parentId: "1",
    note:
      "Linear equations, polynomials, and algebraic structures\n\n" +
      LOREM_NOTE,
    icon: "➗",
    coverImage: undefined,
  },
  {
    id: "15",
    name: "Statistics",
    type: "folder",
    parentId: "1",
    note:
      "Data analysis, probability, and statistical methods\n\n" + LOREM_NOTE,
    icon: "📊",
    coverImage: undefined,
  },
  {
    id: "5",
    name: "Physics",
    type: "subject",
    note: "Study of matter, energy, and their interactions",
    icon: "⚛️",
    coverImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    name: "Mechanics",
    type: "folder",
    parentId: "5",
    note: "Classical mechanics and motion",
    icon: "⚙️",
    coverImage: undefined,
  },
  {
    id: "7",
    name: "Newton's Laws",
    type: "folder",
    parentId: "6",
    note: "Understanding Newton's three laws of motion",
    icon: "🎯",
    coverImage: undefined,
  },
  {
    id: "16",
    name: "Electromagnetism",
    type: "folder",
    parentId: "5",
    note: "Electric and magnetic fields, circuits, and electromagnetic waves",
    icon: "⚡",
    coverImage: undefined,
  },
  {
    id: "17",
    name: "Thermodynamics",
    type: "folder",
    parentId: "5",
    note: "Heat, energy, and the laws of thermodynamics",
    icon: "🌡️",
    coverImage: undefined,
  },
  {
    id: "8",
    name: "History",
    type: "subject",
    note: "Study of past events and their impact on society",
    icon: "🗿",
    coverImage:
      "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "9",
    name: "Modern History",
    type: "folder",
    parentId: "8",
    note: "Events from the 20th century to present",
    icon: "🌍",
    coverImage: undefined,
  },
  {
    id: "10",
    name: "World War II",
    type: "folder",
    parentId: "9",
    note: "Major events, causes, and consequences of WWII",
    icon: "⚔️",
    coverImage: undefined,
  },
  {
    id: "18",
    name: "Ancient Civilizations",
    type: "folder",
    parentId: "8",
    note: "Study of early human civilizations and their development",
    icon: "🏺",
    coverImage: undefined,
  },
  {
    id: "19",
    name: "Renaissance",
    type: "folder",
    parentId: "8",
    note: "Cultural and intellectual rebirth in Europe",
    icon: "🎨",
    coverImage: undefined,
  },
  {
    id: "11",
    name: "Biology",
    type: "subject",
    note: "Study of living organisms and their interactions",
    icon: "🧬",
    coverImage:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "12",
    name: "Cell Biology",
    type: "folder",
    parentId: "11",
    note: "Structure and function of cells",
    icon: "🔬",
    coverImage: undefined,
  },
  {
    id: "13",
    name: "Cell Structure",
    type: "folder",
    parentId: "12",
    note: "Detailed study of cell organelles and their functions",
    icon: "🔍",
    coverImage: undefined,
  },
  {
    id: "20",
    name: "Genetics",
    type: "folder",
    parentId: "11",
    note: "Study of genes, heredity, and genetic variation",
    icon: "🧬",
    coverImage: undefined,
  },
  {
    id: "21",
    name: "Ecology",
    type: "folder",
    parentId: "11",
    note: "Study of organisms and their environment",
    icon: "🌿",
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
  selectedFolderId: "2",
  setSelectedFolderId: (id) => set(() => ({ selectedFolderId: id })),
}));
