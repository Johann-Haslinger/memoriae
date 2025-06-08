import { useEffect, useRef, useState } from "react";
import type { Folder } from "../interfaces";

interface UseNoteProps {
  selectedFolder: Folder | undefined;
  selectedFolderId: string | null;
  onUpdateFolder: (folderId: string, updates: Partial<Folder>) => void;
}

export const useNote = ({
  selectedFolder,
  selectedFolderId,
  onUpdateFolder,
}: UseNoteProps) => {
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(selectedFolder?.note || "");
  const noteDivRef = useRef<HTMLDivElement>(null);

  // Keep noteValue in sync with folder change
  useEffect(() => {
    setNoteValue(selectedFolder?.note || "");
    setEditingNote(false);
  }, [selectedFolderId]);

  // Focus the contentEditable div when editingNote becomes true or when note is empty
  useEffect(() => {
    if ((editingNote || !noteValue) && noteDivRef.current) {
      noteDivRef.current.focus();
    }
  }, [editingNote, noteValue]);

  const handleSaveNote = () => {
    if (selectedFolder) {
      onUpdateFolder(selectedFolder.id, { note: noteValue });
      setEditingNote(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setNoteValue(e.currentTarget.textContent || "");
  };

  return {
    editingNote,
    setEditingNote,
    noteValue,
    noteDivRef,
    handleSaveNote,
    handleInput,
  };
};
