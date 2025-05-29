import React from "react";
import { Button } from "./Button";
import Tooltip from "./Tooltip";

interface NoteSectionProps {
  noteValue: string;
  editingNote: boolean;
  setEditingNote: (v: boolean) => void;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleSaveNote: () => void;
  noteDivRef: React.RefObject<HTMLDivElement | null>;
}

const NoteSection: React.FC<NoteSectionProps> = ({
  noteValue,
  editingNote,
  setEditingNote,
  handleInput,
  handleSaveNote,
  noteDivRef,
}) => {
  return (
    <div className="mt-4 text-[#FFFFFFCF]">
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
    </div>
  );
};

export default NoteSection;
