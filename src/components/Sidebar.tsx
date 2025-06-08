import {
  ChevronDown as LucideChevronDown,
  ChevronRight as LucideChevronRight,
  MoreVertical,
  PanelLeft,
  Search,
  SquarePen,
} from "lucide-react";
import React, { useMemo } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import type { Folder } from "../interfaces";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

import { useFolderStore } from "../store/folderStore";
import { useFolderUIStore } from "../store/folderUIStore";
import { useSidebarStore } from "../store/sidebarStore";

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
  const [showMenu, setShowMenu] = React.useState(false);

  // Check if this folder has any children in the actual folders array
  const hasChildren = folders.some((f) => f.parentId === folder.id);
  const isOpen = openFolders[folder.id] ?? false;
  const isSelected = selectedFolderId === folder.id;

  return (
    <div className="select-none">
      <div
        className={`flex select-none text-sm items-center gap-2 py-1 dark:text-white/80 px-2 rounded-lg transition-colors cursor-pointer group
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
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedFolderId(folder.id);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <div
          className="relative w-6 h-6 flex items-center justify-center"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              toggleFolder(folder.id);
            }
          }}
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
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
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

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const folders = useFolderStore((state) => state.folders);
  const tree = useOpenFoldersTree(folders);

  // Add keyboard shortcut for toggling sidebar
  useKeyboardShortcut({ key: "b", meta: true }, () => toggleSidebar(), [
    toggleSidebar,
  ]);

  // Sidebar width for animation
  const sidebarWidth = isOpen ? 288 : 0; // px values for w-72

  return (
    <>
      <div className="absolute top-2 left-2 z-50">
        <Tooltip
          place="left-end"
          id="toggle-sidebar-tooltip"
          content="Toggle sidebar"
          shortcut={["⌘", "B"]}
        >
          <div
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-lg dark:hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => toggleSidebar()}
          >
            <PanelLeft
              className="text-slate-500 dark:text-[#FFFFFFCF]"
              size={20}
            />
          </div>
        </Tooltip>
      </div>

      <aside
        className={`h-screen transition-all duration-300 ease-in-out border-r pt-16 border-white/5 py-2 bg-white dark:bg-[#141414] text-slate-900 dark:text-slate-100 p-2 flex flex-col ${
          isOpen ? "px-2" : "items-center"
        }`}
        style={{
          width: sidebarWidth,
          minWidth: isOpen ? 256 : 0,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          marginLeft: isOpen ? 0 : "-1rem",
          overflow: "hidden",
        }}
      >
        <div className="flex text-[#FFFFFFCF] flex-col mb-4 pb-2">
          <button
            className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
            onClick={() => {
              // TODO: Implement add folder functionality
            }}
          >
            <div className="flex items-center gap-4">
              <SquarePen className="size-3.5" />
              <span>Add folder</span>
            </div>
          </button>
          <button
            className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
            onClick={() => {
              // Dispatch a custom event to open the command menu
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
          >
            <div className="flex items-center gap-4">
              <Search className="size-3.5" />
              <span>Search folders</span>
            </div>
            <span className="text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity">
              ⌘K
            </span>
          </button>
        </div>

        <p className="text-sm ml-2 font-medium text-white/50 px-2">Subjects</p>
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
