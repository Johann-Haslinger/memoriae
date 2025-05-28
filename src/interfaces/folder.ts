export interface Folder {
  id: string;
  name: string;
  type: "subject" | "folder";
  parentId?: string;
  note?: string;
  icon?: string;
  coverImage?: string;
}
