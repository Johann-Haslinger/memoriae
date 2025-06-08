import { PanelLeft, Search, SquarePen } from "lucide-react";
import { useMemo } from "react";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import type { Folder } from "../../interfaces";
import Tooltip from "../Tooltip";

import { useFolderStore } from "../../store/folderStore";
import { useFolderUIStore } from "../../store/folderUIStore";
import { useSidebarStore } from "../../store/sidebarStore";
import { FolderItem } from "./FolderItem";

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

  const handleAddFolder = () => {
    // TODO: Implement add folder functionality
  };

  const handleSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );
  };

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
            onClick={toggleSidebar}
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
        <div className="flex-1 scrollable">
          <div className="flex text-[#FFFFFFCF] flex-col mb-4 pb-2">
            <button
              className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
              onClick={handleAddFolder}
            >
              <div className="flex items-center gap-4">
                <SquarePen className="size-3.5" />
                <span>Add folder</span>
              </div>
            </button>
            <button
              className="flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
              onClick={handleSearch}
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

          <p className="text-sm ml-2 font-medium text-white/50 px-2">
            Subjects
          </p>
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
        </div>
      </aside>
    </>
  );
};

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

export default Sidebar;
