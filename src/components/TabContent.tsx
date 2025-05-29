import React from "react";
import type { TabType } from "./ContentTabs";
import FolderGrid from "./FolderGrid";
import NoteSection from "./NoteSection";

interface TabContentProps {
  activeTab: TabType;
  noteValue: string;
  editingNote: boolean;
  setEditingNote: (editing: boolean) => void;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleSaveNote: () => void;
  noteDivRef: React.RefObject<HTMLDivElement | null>;
  selectedFolderId: string;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  noteValue,
  editingNote,
  setEditingNote,
  handleInput,
  handleSaveNote,
  noteDivRef,
  selectedFolderId,
}) => {
  if (activeTab === "content") {
    return <FolderGrid parentId={selectedFolderId} />;
  }

  if (activeTab === "notes") {
    return (
      <NoteSection
        noteValue={noteValue}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        handleInput={handleInput}
        handleSaveNote={handleSaveNote}
        noteDivRef={noteDivRef}
        selectedFolderId={selectedFolderId}
      />
    );
  }

  return null;
};

export default TabContent;
