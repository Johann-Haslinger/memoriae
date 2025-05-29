import React from "react";
import type { Folder } from "../interfaces";

interface BreadcrumbProps {
  breadcrumbPath: Folder[];
  setSelectedFolderId: (id: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbPath,
  setSelectedFolderId,
}) => {
  if (breadcrumbPath.length <= 1) return <div className="h-10" />;
  return (
    <nav
      className="text-sm h-10 text-gray-500 dark:text-gray-300 flex items-center gap-1 pb-3 select-none"
      aria-label="Breadcrumb"
    >
      {breadcrumbPath.map((folder, idx) => {
        const isCurrent = idx === breadcrumbPath.length - 1;
        const opacityClass = isCurrent ? "opacity-80" : "opacity-80";
        return (
          <span key={folder.id} className={`flex items-center ${opacityClass}`}>
            {idx > 0 && <span className="opacity-50 mr-2">/</span>}
            {isCurrent ? (
              <span className="text-gray-900 px-1 dark:text-gray-100 flex items-center gap-1">
                <span className="text-base mr-1">{folder.icon || "📁"}</span>
                {folder.name}
              </span>
            ) : (
              <button
                className="flex items-center gap-1 focus:outline-none px-1 rounded-md transition-colors hover:bg-white/5"
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <span className="text-base mr-1">{folder.icon || "📁"}</span>
                {folder.name}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
