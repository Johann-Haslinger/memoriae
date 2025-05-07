"use client";

import { useEffect } from "react";
import FolderList from "../components/folder/FolderList";
import { AppShell, Header } from "../components/layout";
import { Folder } from "../interfaces";
import { FolderService } from "../services/folderService";
import { useFolderStore } from "../store";

const dummyFolders: Folder[] = [
  { id: "1", name: "Folder 1", parentId: null, createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
  { id: "2", name: "Folder 2", parentId: null, createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
  { id: "3", name: "Subfolder 1", parentId: "1", createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
  { id: "4", name: "Subfolder 2", parentId: "1", createdAt: new Date(), updatedAt: new Date(), isDeleted: false },
];

const page = () => {
  const folders = useFolderStore((state) => state.folders);

  useEffect(() => {
    FolderService.addLocal(dummyFolders);
  }, []);

  return (
    <AppShell>
      <Header>Flashcard Sets</Header>
      <FolderList folders={folders} />
    </AppShell>
  );
};

export default page;
