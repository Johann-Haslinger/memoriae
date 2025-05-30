import React from "react";
import type { Folder } from "../interfaces";
import { useSidebarStore } from "../store/sidebarStore";

interface BreadcrumbProps {
  breadcrumbPath: Folder[];
  setSelectedFolderId: (id: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbPath,
  setSelectedFolderId,
}) => {
  const isSidebarOpen = useSidebarStore((state) => state.isOpen);

  if (breadcrumbPath.length <= 1) return <div className="h-14" />;
  return (
    <nav
      className={`w-full transition-all duration-300 ease-in-out px-4 h-14 pt-0.5 text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 select-none ${
        isSidebarOpen ? "pl-4" : "pl-16"
      }`}
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
