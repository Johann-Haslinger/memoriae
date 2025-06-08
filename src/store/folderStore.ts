import { create } from "zustand";
import type { Folder } from "../interfaces";
import { supabase } from "../lib/supabase";
import { toCamelCase, toSnakeCase } from "../utils";

interface FolderState {
  folders: Folder[];
  addFolder: (folder: Folder) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  updateFolder: (id: string, updatedFields: Partial<Folder>) => Promise<void>;
  setFolders: (folders: Folder[]) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  fetchFolders: () => Promise<void>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  addFolder: async (folder) => {
    const { error } = await supabase
      .from("folders")
      .insert([toSnakeCase(folder)]);

    if (error) {
      console.error("Error adding folder:", error);
      throw error;
    }

    set((state) => ({
      folders: [...state.folders, folder],
    }));
  },
  removeFolder: async (id) => {
    const { error } = await supabase.from("folders").delete().eq("id", id);

    if (error) {
      console.error("Error removing folder:", error);
      throw error;
    }

    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    }));
  },
  updateFolder: async (id, updatedFields) => {
    const { error } = await supabase
      .from("folders")
      .update(toSnakeCase(updatedFields))
      .eq("id", id);

    if (error) {
      console.error("Error updating folder:", error);
      throw error;
    }

    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === id ? { ...folder, ...updatedFields } : folder
      ),
    }));
  },
  setFolders: (folders) => set(() => ({ folders })),
  selectedFolderId: null,
  setSelectedFolderId: (id) => set(() => ({ selectedFolderId: id })),
  fetchFolders: async () => {
    const selectedFolderId = get().selectedFolderId;

    // If no folder is selected, fetch only subjects
    if (!selectedFolderId) {
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("type", "subject")
        .order("name");

      if (error) {
        console.error("Error fetching folders:", error);
        throw error;
      }

      set(() => ({ folders: (data || []).map(toCamelCase) as Folder[] }));
      return;
    }

    // If a folder is selected, fetch all folders
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching folders:", error);
      throw error;
    }

    set(() => ({ folders: (data || []).map(toCamelCase) as Folder[] }));
  },
}));
