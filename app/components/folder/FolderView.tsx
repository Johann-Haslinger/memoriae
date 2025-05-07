"use client";

import { FolderId } from "../../interfaces";
import { useFolderStore } from "../../store";
import { AppShell, Header } from "../layout";
import FolderList from "./FolderList";
import FolderPath from "./FolderPath";

const FolderView = ({ folderId }: { folderId: FolderId }) => {
  const folder = useFolderStore((state) => state.folders.find((folder) => folder.id === folderId));
  const name = folder ? folder.name : "Folder not found";
  const childFolders = useChildFolders(folderId);

  return (
    folder && (
      <AppShell>
        <FolderPath folder={folder} />
        <Header>📁 {name}</Header>
        <FolderList folders={childFolders} />
      </AppShell>
    )
  );
};

export default FolderView;

const useChildFolders = (folderId: FolderId) => {
  const folders = useFolderStore((state) => state.folders);
  return folders.filter((folder) => folder.parentId === folderId);
};
