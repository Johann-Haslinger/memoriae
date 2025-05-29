import { MoreVertical, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Folder } from "../interfaces";
import { useFolderStore } from "../store/folderStore";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

interface FolderGridProps {
  parentId: string | null;
}

const FolderGrid: React.FC<FolderGridProps> = ({ parentId }) => {
  const folders = useFolderStore((state) => state.folders);
  const addFolder = useFolderStore((state) => state.addFolder);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const removeFolder = useFolderStore((state) => state.removeFolder);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [showMenuForFolder, setShowMenuForFolder] = useState<string | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const childFolders = folders.filter((folder) => folder.parentId === parentId);

  // Handle click outside for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenuForFolder(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Math.random().toString(36).substr(2, 9),
        name: newFolderName.trim(),
        type: "folder",
        parentId: parentId || undefined,
        icon: "📁",
        lastEditedAt: new Date().toISOString(),
      };
      addFolder(newFolder);
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  const handleUpdateFolderName = (folderId: string) => {
    if (editingFolderName.trim()) {
      updateFolder(folderId, {
        name: editingFolderName.trim(),
        lastEditedAt: new Date().toISOString(),
      });
      setEditingFolderId(null);
      setEditingFolderName("");
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    removeFolder(folderId);
    setShowMenuForFolder(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#FFFFFFCF]">Notes</h2>
        {!isAddingFolder ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddingFolder(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Folder
          </Button>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="px-3 py-1 outline-blue-400/80 rounded bg-[#2a2a2a] dark:bg-[#1a1a1a] text-white placeholder-[#666666] border border-[#404040] dark:border-[#2a2a2a]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddFolder();
                } else if (e.key === "Escape") {
                  setIsAddingFolder(false);
                  setNewFolderName("");
                }
              }}
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleAddFolder}
              disabled={!newFolderName.trim()}
            >
              Create
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingFolder(false);
                setNewFolderName("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {childFolders.map((folder) => (
          <div
            key={folder.id}
            className="bg-[#2a2a2a] select-none border-white/5 dark:bg-white/[0.03] rounded-lg p-4 cursor-pointer hover:bg-[#333333] dark:hover:bg-[#222222] transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{folder.icon || "📁"}</span>
              <div className="relative" ref={menuRef}>
                <Tooltip
                  id={`folder-menu-${folder.id}`}
                  content="Folder options"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuForFolder(
                        showMenuForFolder === folder.id ? null : folder.id
                      );
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-[#999999]" />
                  </Button>
                </Tooltip>
                {showMenuForFolder === folder.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-[#333333] dark:bg-[#222222] rounded-lg shadow-lg border border-[#404040] dark:border-[#2a2a2a] z-10">
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-[#FFFFFFCF] hover:bg-[#404040] dark:hover:bg-[#2a2a2a]"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                          setEditingFolderName(folder.name);
                          setShowMenuForFolder(null);
                        }}
                      >
                        Rename
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#404040] dark:hover:bg-[#2a2a2a]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {editingFolderId === folder.id ? (
              <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  className="w-full px-2 py-1 rounded bg-[#333333] dark:bg-[#1a1a1a] text-white border border-[#404040] dark:border-[#2a2a2a]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateFolderName(folder.id);
                    } else if (e.key === "Escape") {
                      setEditingFolderId(null);
                      setEditingFolderName("");
                    }
                  }}
                />
              </div>
            ) : (
              <h3
                className="font-medium text-[#FFFFFFCF] mb-2"
                onClick={() => setSelectedFolderId(folder.id)}
              >
                {folder.name}
              </h3>
            )}
            {folder.note && (
              <p className="text-sm text-[#999999] mb-2 line-clamp-2">
                {folder.note}
              </p>
            )}
            {folder.lastEditedAt && (
              <p className="text-xs text-[#666666]">
                Last edited: {formatDate(folder.lastEditedAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;
