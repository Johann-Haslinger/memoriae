"use client";

import { Folder } from "../../interfaces";
import FolderCard from "./FolderCard";

const FolderList = ({ folders }: { folders: Folder[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {folders.map((folder) => (
        <FolderCard key={folder.id} folder={folder} />
      ))}
    </div>
  );
};

export default FolderList;
