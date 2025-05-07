"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, FolderId } from "../../interfaces";
import { useFolderStore } from "../../store";

const usePathFolders = (folder: Folder) => {
  const pathname = usePathname();
  const path = pathname.split("/").filter(Boolean);
  const folderIndex = path.findIndex((segment: string) => segment === folder.name);
  return folderIndex !== -1 ? path.slice(0, folderIndex + 1) : path;
};

const FolderPath = ({ folder }: { folder: Folder }) => {
  const path = usePathFolders(folder);

  const buildPath = (index: number) => `/${path.slice(0, index + 1).join("/")}`;

  return (
    <div className="flex items-center">
      <div>
        <Link className="cursor-pointer hover:underline opacity-40" href="/">
          Home
        </Link>
      </div>
      {path.map((id, index) => (
        <PathSegment path={buildPath(index)} key={id} folderId={id as FolderId} isLast={index == path.length - 1} />
      ))}
    </div>
  );
};

export default FolderPath;

const PathSegment = ({ folderId, isLast, path }: { folderId: FolderId; isLast: boolean; path: string }) => {
  const folderName = useFolderStore((state) => state.folders.find((folder) => folder.id === folderId)?.name);

  return (
    <div className={!isLast ? "opacity-40" : "opacity-860"}>
      <Link className={!isLast ? "cursor-pointer hover:underline" : ""} href={path}>
        {folderName}
      </Link>
      {!isLast && <span className="px-1.5">/</span>}
    </div>
  );
};
