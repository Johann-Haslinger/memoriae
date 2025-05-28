import {
  Book as LucideBook,
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  Folder as LucideFolder,
  PanelLeft,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import type { Folder } from "../interfaces";

import { useFolderStore } from "../store/folderStore";
import { useFolderUIStore } from "../store/folderUIStore";

const FolderItem: React.FC<{
  folder: Folder & { children: Folder[] };
  level?: number;
}> = ({ folder, level = 0 }) => {
  const { openFolders, toggleFolder } = useFolderUIStore();
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const isOpen = openFolders[folder.id] ?? false;
  const hasChildren = folder.children.length > 0;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div>
      <div
        className={`flex select-none text-sm items-center gap-2 py-1.5 dark:text-white/60 px-2 rounded-lg transition-colors cursor-pointer
          ${level === 0 ? "" : ""}
          hover:bg-slate-100 dark:hover:bg-white/5 hover:text-white/100
          ${isSelected ? "bg-blue-100 dark:bg-white/5 dark:text-white/100" : ""}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedFolderId(folder.id);
        }}
        onDoubleClick={() => hasChildren && toggleFolder(folder.id)}
      >
        <span className="truncate flex-1">{folder.name}</span>
        {hasChildren ? (
          <span className="flex items-center">
            {isOpen ? (
              <LucideChevronDown className="text-white/50 ml-1 w-4 h-4" />
            ) : (
              <LucideChevronRight className="text-white/50 ml-1 w-4 h-4" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}
      </div>
      {hasChildren && isOpen && (
        <div
          style={{
            paddingLeft: `${level + 1 * 8}px`,
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

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const folders = useFolderStore((state) => state.folders);
  const tree = useOpenFoldersTree(folders);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  // Sidebar width for animation
  const sidebarWidth = open ? 288 : 96; // px values for w-72 and w-24

  // Only show top-level folders/subjects in collapsed state
  const topLevelFolders = tree;

  return (
    <>
      <aside
        className={`h-screen bg-white dark:bg-white/[0.08] text-slate-900 dark:text-slate-100 p-2 flex flex-col border-r border-slate-200 dark:border-white/[0.05] transition-all duration-300 ease-in-out ${
          open ? "p-4" : "items-center"
        }`}
        style={{
          width: sidebarWidth,
          minWidth: open ? 256 : 64,
        }}
      >
        {/* Close button (now in a flex row at the top) */}
        {open ? (
          <div className="w-full mb-2  mb-2">
            <button
              className="p-1.5 hover:bg-slate-200 rounded-lg dark:hover:bg-white/10 transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <PanelLeft
                size={22}
                className="text-slate-500 dark:text-white/60"
              />
            </button>
          </div>
        ) : (
          // Open button inside ^im sidebar
          <button
            className="mb-6 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-slate-800 shadow-md transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
          >
            <LucideChevronRight className="text-slate-700 dark:text-slate-200" />
          </button>
        )}
        {open ? (
          <>
            <nav className="flex-1  mt-2 space-y-2 overflow-y-auto pr-2">
              {tree.length === 0 && (
                <div className="text-slate-400">No subjects yet.</div>
              )}
              {tree.map((folder) => (
                <FolderItem
                  key={folder.id}
                  folder={folder as Folder & { children: Folder[] }}
                />
              ))}
            </nav>
          </>
        ) : (
          // Collapsed: show only icons for top-level folders/subjects
          <nav className="flex-1 flex flex-col items-center gap-4 mt-2 overflow-y-auto">
            {topLevelFolders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors focus:outline-none ${
                    isSelected
                      ? "bg-blue-100 dark:bg-white/10"
                      : "hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedFolderId(folder.id)}
                  title={folder.name}
                >
                  {folder.type === "subject" ? (
                    <LucideBook className="text-blue-400 w-6 h-6" />
                  ) : (
                    <LucideFolder className="text-yellow-400 w-6 h-6" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </aside>
    </>
  );
};

export default Sidebar;

function useOpenFoldersTree(folders: Folder[]): Folder[] {
  const openFolders = useFolderUIStore((state) => state.openFolders);

  // Build a map of folders by parentId for quick lookup
  const foldersByParent = useMemo(() => {
    const map: Record<string, Folder[]> = {};
    for (const folder of folders) {
      const parentKey = folder.parentId ?? "root";
      if (!map[parentKey]) {
        map[parentKey] = [];
      }
      map[parentKey].push(folder);
    }
    return map;
  }, [folders]);

  // Move buildTree here:

  // Root folders are those with no parentId (subjects)
  return useMemo(() => {
    function buildTree(parentId: string | null): Folder[] {
      const children = foldersByParent[parentId ?? "root"] || [];
      return children.map((folder) => {
        let childFolders: Folder[] = [];
        // Always expand root subjects, only expand children if open
        if (parentId === null || openFolders[folder.id]) {
          childFolders = buildTree(folder.id);
        }
        return {
          ...folder,
          children: childFolders,
        };
      });
    }

    return buildTree(null);
  }, [foldersByParent, openFolders]);
}
