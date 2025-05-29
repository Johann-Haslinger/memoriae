import {
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  PanelLeft,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import type { Folder } from "../interfaces";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

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
  const folders = useFolderStore((state) => state.folders);

  // Check if this folder has any children in the actual folders array
  const hasChildren = folders.some((f) => f.parentId === folder.id);
  const isOpen = openFolders[folder.id] ?? false;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div>
      <div
        className={`flex select-none text-sm items-center gap-2 py-1 dark:text-white/80 px-2 rounded-lg transition-colors cursor-pointer
            ${level === 0 ? "" : ""}
            hover:bg-slate-100 dark:hover:bg-white/5 hover:text-white/100
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400/80
            focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a1a1a]
            ${
              isSelected
                ? "bg-blue-100 dark:bg-white/5 dark:text-white/100"
                : ""
            }
          `}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedFolderId(folder.id);
        }}
        onDoubleClick={() => hasChildren && toggleFolder(folder.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (hasChildren) {
              toggleFolder(folder.id);
            }
            setSelectedFolderId(folder.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <span className="mr-2 text-lg">{folder.icon}</span>
        <span className="truncate flex-1">{folder.name}</span>

        {hasChildren ? (
          <Tooltip
            id={`open-folder-${folder.id}`}
            content={isOpen ? "Close folder" : "Open folder"}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.id);
              }}
            >
              {isOpen ? (
                <LucideChevronDown className="text-white/50 w-4 h-4" />
              ) : (
                <LucideChevronRight className="text-white/50 w-4 h-4" />
              )}
            </Button>
          </Tooltip>
        ) : (
          <span className="w-4" />
        )}
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

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const folders = useFolderStore((state) => state.folders);
  const tree = useOpenFoldersTree(folders);
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  // Add keyboard shortcut for toggling sidebar
  useKeyboardShortcut(
    { key: "b", meta: true },
    () => setOpen((prev) => !prev),
    [setOpen]
  );

  // Sidebar width for animation
  const sidebarWidth = open ? 288 : 60; // px values for w-72 and w-24

  // Only show top-level folders/subjects in collapsed state
  const topLevelFolders = tree;

  return (
    <>
      <aside
        className={`h-screen border-r border-white/5 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-slate-100 p-2 flex flex-col transition-all duration-300 ease-in-out ${
          open ? "px-2" : "items-center"
        }`}
        style={{
          width: sidebarWidth,
          minWidth: open ? 256 : 64,
        }}
      >
        {/* Close button (now in a flex row at the top) */}
        <div
          className={`w-full mb-2 transition-all justify-between flex ${
            open ? "pl-1" : "pl-1"
          }`}
        >
          <Tooltip
            place="right-end"
            id="close-sidebar-tooltip"
            content="Close sidebar"
            shortcut={["⌘", "B"]}
          >
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={() => setOpen(!open)}
              aria-label="Close sidebar"
            >
              <PanelLeft
                size={22}
                className="text-slate-500 dark:text-white/60"
              />
            </Button>
          </Tooltip>
        </div>

        {open ? (
          <>
            <nav className="flex-1 pt-2 space-y-2 overflow-y-auto pr-2 -ml-2 pl-4">
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
          <nav className="flex-1 flex flex-col items-center gap-3 mt-3 overflow-y-auto">
            {topLevelFolders.map((folder) => {
              // Helper to check if selectedFolderId is this folder or any of its descendants
              function isFolderOrDescendantSelected(folderId: string): boolean {
                if (selectedFolderId === folderId) return true;
                // Find all children recursively
                const stack = [folderId];
                while (stack.length > 0) {
                  const currentId = stack.pop();
                  const children = folders.filter(
                    (f) => f.parentId === currentId
                  );
                  for (const child of children) {
                    if (child.id === selectedFolderId) return true;
                    stack.push(child.id);
                  }
                }
                return false;
              }
              const isSelected = isFolderOrDescendantSelected(folder.id);
              return (
                <Tooltip
                  key={folder.id}
                  id={`collapsed-folder-${folder.id}`}
                  content={folder.name}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={
                      isSelected
                        ? "bg-blue-100 dark:bg-white/10 rounded-lg"
                        : ""
                    }
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <span className="text-xl">{folder.icon || "📁"}</span>
                  </Button>
                </Tooltip>
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

  return useMemo(() => {
    function buildTree(parentId: string | null): Folder[] {
      const children = foldersByParent[parentId ?? "root"] || [];
      return children.map((folder) => {
        // Always include children for root folders (subjects)
        // For other folders, include children if the folder is open
        const childFolders =
          parentId === null || openFolders[folder.id]
            ? buildTree(folder.id)
            : [];

        return {
          ...folder,
          children: childFolders,
        };
      });
    }

    return buildTree(null);
  }, [foldersByParent, openFolders]);
}
