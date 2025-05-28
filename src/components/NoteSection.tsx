import React from "react";

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
    <div className="mt-6 opacity-80">
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
        <button
          onClick={() => setEditingNote(true)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      )}
    </div>
  );
};

export default NoteSection;
