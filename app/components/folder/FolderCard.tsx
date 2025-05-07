"use client";

import { useRouter } from "next/navigation";
import { Folder } from "../../interfaces";

const FolderCard = ({ folder }: { folder: Folder }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/sets/${folder.id}`);
  };

  return (
    <div
      className="p-4 shadow-md bg-white hover:scale-105 hover:cursor-pointer select-none transition-all min-h-40 dark:bg-white/5"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-black dark:text-white/90 mb-2">{folder.name}</h3>
      <p className="text-sm text-black/50 dark:text-white/50">"No description available"</p>
    </div>
  );
};

export default FolderCard;
