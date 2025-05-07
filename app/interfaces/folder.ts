export type FolderId = string;

export interface Folder {
  id: FolderId;
  name: string;
  parentId: FolderId | null;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
