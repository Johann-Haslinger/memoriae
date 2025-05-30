import { Command } from "cmdk";
import { ArrowDown, ArrowUp, CornerDownLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import type { Folder } from "../interfaces";
import { useFolderStore } from "../store/folderStore";

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const folders = useFolderStore((state) => state.folders);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  // Filter folders based on search query
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update selection when search results change
  useEffect(() => {
    if (selectedIndex >= filteredFolders.length) {
      setSelectedIndex(Math.max(0, filteredFolders.length - 1));
    }
  }, [filteredFolders, selectedIndex]);

  // Open command menu with Cmd+K
  useKeyboardShortcut({ key: "k", meta: true }, () => {
    setOpen((open) => !open);
    setSelectedIndex(0); // Reset selection when opening
    setSearchQuery(""); // Reset search when opening
  });

  // Close on escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredFolders.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredFolders.length) % filteredFolders.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedFolder = filteredFolders[selectedIndex];
        if (selectedFolder) {
          setSelectedFolderId(selectedFolder.id);
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredFolders, selectedIndex, setSelectedFolderId]);

  // Get folder path for display
  const getFolderPath = (folder: Folder): string => {
    const path: string[] = [];
    let current: Folder | undefined = folder;
    while (current) {
      path.unshift(current.name);
      if (current.parentId) {
        current = folders.find((f) => f.id === current!.parentId);
      } else {
        current = undefined;
      }
    }
    return path.join(" / ");
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-2xl bg-white dark:bg-[#1a1919] rounded-2xl shadow-lg transition-transform ${
            open ? "scale-100" : "scale-95"
          }`}
        >
          <Command className="rounded-2xl border border-white/5">
            <div className="flex items-center border-b border-white/5 px-3">
              <Command.Input
                placeholder="Search folders..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex-1 placeholder:text-neutral-500 bg-transparent px-2 py-4 outline-none text-lg"
              />
            </div>
            <Command.List className="max-h-[500px] overflow-y-auto p-2 space-y-1">
              <Command.Empty className="py-6 text-center text-sm text-neutral-500">
                No folders found.
              </Command.Empty>
              {filteredFolders.map((folder, index) => (
                <Command.Item
                  key={folder.id}
                  value={folder.name}
                  onSelect={() => {
                    setSelectedFolderId(folder.id);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-4 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 rounded-xl cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-neutral-100 dark:bg-white/10"
                      : ""
                  }`}
                >
                  <span className="text-lg">{folder.icon || "📁"}</span>
                  <div className="flex flex-col flex-1">
                    <span className="text-base">{folder.name}</span>
                    <span className="text-xs text-neutral-500">
                      {getFolderPath(folder)}
                    </span>
                  </div>
                  {index === selectedIndex && (
                    <CornerDownLeft className="w-4 h-4 text-neutral-400" />
                  )}
                </Command.Item>
              ))}
            </Command.List>
            <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-white/5 text-xs text-neutral-500">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3" />
                <ArrowDown className="w-3 h-3" />
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" />
                <span>to select</span>
              </div>
            </div>
          </Command>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;
