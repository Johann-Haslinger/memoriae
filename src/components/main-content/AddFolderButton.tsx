import { Plus } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Folder } from "../../interfaces";
import { useAuthStore } from "../../store/authStore";
import { useFolderStore } from "../../store/folderStore";
import { Button } from "../Button";

interface AddFolderButtonProps {
  type: "folder" | "subject";
  parentId: string | null;
  activeTab: "notes" | "flashcards" | "quizzes" | "content";
}

const AddFolderButton: React.FC<AddFolderButtonProps> = ({
  parentId,
  activeTab,
  type = "folder",
}) => {
  const addFolder = useFolderStore((state) => state.addFolder);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const userId = useAuthStore((state) => state.user?.id);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: uuidv4(),
        userId: userId || "",
        name: newFolderName.trim(),
        type,
        parentId: parentId || undefined,
        icon: "📁",
        lastEditedAt: new Date().toISOString(),
      };
      addFolder(newFolder);
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  if (activeTab !== "content") {
    return null;
  }

  if (!isAddingFolder) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAddingFolder(true)}
        className="flex items-center gap-2 text-white/50 hover:text-white/70"
      >
        <Plus className="w-4 h-4" />
        Add Folder
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
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
        className="text-white/50 hover:text-white/70"
      >
        Cancel
      </Button>
    </div>
  );
};

export default AddFolderButton;
