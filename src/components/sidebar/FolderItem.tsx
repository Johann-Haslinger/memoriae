import {
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  MoreVertical,
} from "lucide-react";
import React, { useState } from "react";
import type { Folder } from "../../interfaces";
import { useFolderStore } from "../../store/folderStore";
import { useFolderUIStore } from "../../store/folderUIStore";
import { Button } from "../Button";

interface FolderItemProps {
  folder: Folder & { children: Folder[] };
  level?: number;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  level = 0,
}) => {
  const { openFolders, toggleFolder } = useFolderUIStore();
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const folders = useFolderStore((state) => state.folders);
  const [showMenu, setShowMenu] = useState(false);

  const hasChildren = folders.some((f) => f.parentId === folder.id);
  const isOpen = openFolders[folder.id] ?? false;
  const isSelected = selectedFolderId === folder.id;

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolderId(folder.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedFolderId(folder.id);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.stopPropagation();
      toggleFolder(folder.id);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div className="select-none">
      <div
        className={`flex select-none text-sm items-center gap-2 py-1 dark:text-white/80 px-2 rounded-lg transition-colors cursor-pointer group
            hover:bg-slate-100 dark:hover:bg-white/5 hover:text-white/100
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400/80
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a1a1a]
            ${
              isSelected
                ? "bg-blue-100 dark:bg-white/5 dark:text-white/100"
                : ""
            }`}
        onClick={handleFolderClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <div
          className="relative w-6 h-6 flex items-center justify-center"
          onClick={handleToggleClick}
        >
          {hasChildren ? (
            <>
              <span className="absolute text-base transition-opacity group-hover:opacity-0">
                {folder.icon}
              </span>
              <span className="absolute text-lg opacity-0 group-hover:opacity-100">
                {isOpen ? (
                  <LucideChevronDown className="text-white/50 w-4 h-4" />
                ) : (
                  <LucideChevronRight className="text-white/50 w-4 h-4" />
                )}
              </span>
            </>
          ) : (
            <span className="text-lg">{folder.icon}</span>
          )}
        </div>
        <span className="truncate flex-1">{folder.name}</span>

        <div className="flex items-center gap-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleMenuClick}
            >
              <MoreVertical className="text-white/50 w-4 h-4" />
            </Button>

            {showMenu && (
              <div
                className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-[#1a1a1a] ring-1 ring-black ring-opacity-5 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1" role="menu">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                    role="menuitem"
                    onClick={() => {
                      // TODO: Implement rename functionality
                      setShowMenu(false);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/5"
                    role="menuitem"
                    onClick={() => {
                      // TODO: Implement delete functionality
                      setShowMenu(false);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {hasChildren && isOpen && (
        <div
          style={{
            paddingLeft: `${level + 1 * 16}px`,
            userSelect: "none",
          }}
          className="space-y-1 mt-1"
        >
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child as Folder & { children: Folder[] }}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
