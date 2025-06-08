import { MoreVertical } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Folder } from "../../interfaces";
import { useFolderStore } from "../../store/folderStore";
import { Button } from "../Button";
import Tooltip from "../Tooltip";

interface FolderGridProps {
  parentId: string | null;
}

interface FolderCardProps {
  folder: Folder;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onSelect,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(folder.name);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Handle click outside for menu
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleUpdateName = () => {
    if (editingName.trim() && editingName !== folder.name) {
      onRename(folder.id, editingName.trim());
    }
    setIsEditing(false);
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
    <div
      className="bg-[#2a2a2a] select-none border-white/5 dark:bg-white/[0.03] rounded-lg p-4 cursor-pointer hover:bg-[#333333] dark:hover:bg-[#222222] transition-colors"
      onClick={() => onSelect(folder.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl mb-2 m-1">{folder.icon || "📁"}</span>
        <div
          className="relative"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip id={`folder-menu-${folder.id}`} content="Folder options">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowMenu((v) => !v)}
            >
              <MoreVertical className="w-4 h-4 text-[#999999]" />
            </Button>
          </Tooltip>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-[#333333] dark:bg-[#222222] rounded-lg shadow-lg border border-[#404040] dark:border-[#2a2a2a] z-10">
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-[#FFFFFFCF] hover:bg-[#404040] dark:hover:bg-[#2a2a2a]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setEditingName(folder.name);
                    setShowMenu(false);
                  }}
                >
                  Rename
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#404040] dark:hover:bg-[#2a2a2a]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(folder.id);
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
      {isEditing ? (
        <div className="mb-3 space-y-1" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full px-2 py-1 rounded bg-[#333333] dark:bg-[#1a1a1a] text-white border border-[#404040] dark:border-[#2a2a2a]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdateName();
              } else if (e.key === "Escape") {
                setIsEditing(false);
                setEditingName(folder.name);
              }
            }}
            onBlur={() => {
              setIsEditing(false);
              setEditingName(folder.name);
            }}
          />
        </div>
      ) : (
        <h3 className="font-medium text-[#FFFFFFCF] mb-1">{folder.name}</h3>
      )}
      {folder.note && (
        <p className="text-sm text-[#999999] line-clamp-2">{folder.note}</p>
      )}
      {folder.lastEditedAt && (
        <p className="text-[#666666]">{formatDate(folder.lastEditedAt)}</p>
      )}
    </div>
  );
};

const FolderGrid: React.FC<FolderGridProps> = ({ parentId }) => {
  const folders = useFolderStore((state) => state.folders);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const removeFolder = useFolderStore((state) => state.removeFolder);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );

  const childFolders = folders.filter((folder) =>
    !parentId ? !folder.parentId : folder.parentId === parentId
  );

  const handleRename = (folderId: string, newName: string) => {
    updateFolder(folderId, {
      name: newName,
      lastEditedAt: new Date().toISOString(),
    });
  };

  const handleDelete = (folderId: string) => {
    removeFolder(folderId);
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {childFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            onSelect={setSelectedFolderId}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderGrid;
