import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import type { Folder } from "../interfaces";
import { useFolderStore } from "../store/folderStore";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

interface NoteSectionProps {
  noteValue: string;
  editingNote: boolean;
  setEditingNote: (v: boolean) => void;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleSaveNote: () => void;
  noteDivRef: React.RefObject<HTMLDivElement | null>;
  selectedFolderId: string;
}

interface CollapsibleNoteProps {
  folder: Folder;
  level: number;
  isInitiallyOpen: boolean;
}

const CollapsibleNote: React.FC<CollapsibleNoteProps> = ({
  folder,
  level,
  isInitiallyOpen,
}) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const folders = useFolderStore((state) => state.folders);
  const subfolders = folders.filter((f) => f.parentId === folder.id);

  return (
    <div className="relative">
      <div className="flex items-start gap-2">
        {/* Chevron button - always visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-white/10 rounded-md transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Folder icon and name */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{folder.icon || "📁"}</span>
          <span className="font-medium">{folder.name}</span>
        </div>
      </div>

      {/* Note content with vertical line */}
      {folder.note && (
        <div className="relative pl-12 mt-2">
          {/* Vertical line */}
          <div className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-white/20" />

          {/* Note text */}
          <div className="text-white/70">{folder.note}</div>
        </div>
      )}

      {/* Subfolders */}
      {isOpen && subfolders.length > 0 && (
        <div className="mt-4 space-y-4">
          {subfolders.map((subfolder) => (
            <div key={subfolder.id} className="pl-8">
              <CollapsibleNote
                folder={subfolder}
                level={level + 1}
                isInitiallyOpen={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NoteSection: React.FC<NoteSectionProps> = ({
  noteValue,
  editingNote,
  setEditingNote,
  handleInput,
  handleSaveNote,
  noteDivRef,
  selectedFolderId,
}) => {
  const folders = useFolderStore((state) => state.folders);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const subfolders = folders.filter((f) => f.parentId === selectedFolderId);

  return (
    <div className="text-[#FFFFFFCF]">
      {noteValue || editingNote ? (
        <div
          ref={noteDivRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleSaveNote}
          tabIndex={0}
          className="outline-none"
        >
          {noteValue}
        </div>
      ) : (
        <Tooltip id="add-note-tooltip" content="Add a note to this folder">
          <Button
            onClick={() => setEditingNote(true)}
            variant="default"
            size="sm"
          >
            Add Note
          </Button>
        </Tooltip>
      )}

      {selectedFolder && subfolders.length > 0 && (
        <div className="mt-8 space-y-6">
          {subfolders.map((subfolder) => (
            <CollapsibleNote
              key={subfolder.id}
              folder={subfolder}
              level={1}
              isInitiallyOpen={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteSection;
