import { ApiResponse, Folder } from "../../interfaces";

export class SupabaseFolderManager {
  static async createFolder(folder: Folder): Promise<ApiResponse<Folder>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: folder,
          error: null,
        });
      }, 1000);
    });
  }

  static async fetchFoldersByUser(userId: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "React", userId },
          { id: 2, name: "Supabase", userId },
        ]);
      }, 1000);
    });
  }

  static async updateFolder(folder: { id: number; name: string }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(folder);
      }, 1000);
    });
  }

  static async deleteFolder(folderId: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(folderId);
      }, 1000);
    });
  }
}
