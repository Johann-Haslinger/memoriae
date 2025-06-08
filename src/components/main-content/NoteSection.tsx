import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import type { Folder } from "../../interfaces";
import { useFolderStore } from "../../store/folderStore";

interface NoteSectionProps {
  noteValue: string;
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
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const subfolders = folders.filter((f) => f.parentId === folder.id);

  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolderId(folder.id);
  };

  return (
    <div className="relative">
      <div className="flex items-start space-x-1">
        {/* Chevron button - always visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-white/50 mt-2 size-6 hover:bg-white/10 rounded-md transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Folder icon and name */}
        <div
          onClick={handleFolderClick}
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-md transition-colors"
        >
          <span className="text-xl">{folder.icon || "📁"}</span>
          <span className="font-semibold">{folder.name}</span>
        </div>
      </div>

      {/* Note content with vertical line - only shown when open */}
      {isOpen && folder.note && (
        <div className="relative pl-12 mt-2">
          {/* Vertical line */}
          <div className="absolute left-[0.7rem] top-0 h-[calc(100%-0.5rem)] w-px bg-white/20" />

          {/* Note text */}
          <div className="text-white/70">{folder.note}</div>

          {/* Subfolders */}
          {isOpen && subfolders.length > 0 && (
            <div className="mt-4 space-y-4">
              {subfolders.map((subfolder) => (
                <div key={subfolder.id}>
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
      )}
    </div>
  );
};

const NoteSection: React.FC<NoteSectionProps> = ({
  noteValue,
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
      <div
        ref={noteDivRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleSaveNote}
        tabIndex={0}
        className="outline-none min-h-[100px]"
      >
        {noteValue}
      </div>

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
