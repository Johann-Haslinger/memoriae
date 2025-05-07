import { Folder } from "../interfaces";
import { SupabaseFolderManager } from "../lib/supabase";
import { useFolderStore } from "../store";

export class FolderService {
  static async create(folder: Folder) {
    const { error } = await SupabaseFolderManager.createFolder(folder);

    if (error) {
      console.error("Error creating folder:", error);
    }

    const folderStore = useFolderStore.getState();
    folderStore.addFolder(folder);
  }

  static addLocal(folderOrFolders: Folder | Folder[]) {
    const folderStore = useFolderStore.getState();
    if (Array.isArray(folderOrFolders)) {
      folderOrFolders.forEach((folder) => folderStore.addFolder(folder));
    } else {
      folderStore.addFolder(folderOrFolders);
    }
  }
}
