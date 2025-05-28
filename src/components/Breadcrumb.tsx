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
        const opacityClass = isCurrent ? "opacity-80" : "opacity-50";
        return (
          <span key={folder.id} className={`flex items-center ${opacityClass}`}>
            {idx > 0 && <span className="mx-1">/</span>}
            {isCurrent ? (
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {folder.name}
              </span>
            ) : (
              <button
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                onClick={() => setSelectedFolderId(folder.id)}
              >
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
