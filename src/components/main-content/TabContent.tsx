import { Brain, FileText, Folder as FolderIcon, Plus } from "lucide-react";
import React from "react";
import type { Folder } from "../../interfaces";
import { Button } from "../Button";
import Flashcards from "./Flashcards";
import FolderGrid from "./FolderGrid";
import NoteSection from "./NoteSection";
import type { TabType } from "./TabBar";

interface TabContentProps {
  activeTab: TabType;
  noteValue: string;
  handleInput: (e: React.FormEvent<HTMLDivElement>) => void;
  handleSaveNote: () => void;
  noteDivRef: React.RefObject<HTMLDivElement | null>;
  selectedFolderId: string;
  onAddFlashcard?: () => void;
  folders: Folder[];
  flashcards: { folderId: string }[];
}

const EmptyState: React.FC<{ type: TabType; onAction?: () => void }> = ({
  type,
  onAction,
}) => {
  const getContent = () => {
    switch (type) {
      case "content":
        return {
          icon: FolderIcon,
          title: "No Content Yet",
          description: "Add a folder to get started",
        };
      case "notes":
        return {
          icon: FileText,
          title: "No Notes Yet",
          description: "Add your first note to this folder",
          action: "Add Note",
        };
      case "flashcards":
        return {
          icon: Brain,
          title: "No Flashcards Yet",
          description: "Create your first flashcard to start learning",
          action: "Add Flashcard",
        };
      default:
        return {
          icon: FolderIcon,
          title: "Empty",
          description: "No content available",
          action: "",
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <content.icon className="w-12 h-12 text-white/30 mb-4" />
      <h3 className="text-xl font-medium text-white/70 mb-2">
        {content.title}
      </h3>
      <p className="text-white/50 mb-6">{content.description}</p>
      {content.action && onAction && (
        <Button
          variant="default"
          size="sm"
          onClick={onAction}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {content.action}
        </Button>
      )}
    </div>
  );
};

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  noteValue,
  handleInput,
  handleSaveNote,
  noteDivRef,
  selectedFolderId,
  onAddFlashcard,
  folders,
  flashcards,
}) => {
  if (activeTab === "content") {
    const hasSubfolders = folders.some((f) => f.parentId === selectedFolderId);
    if (!hasSubfolders) {
      return <EmptyState type="content" onAction={() => {}} />;
    }
    return <FolderGrid parentId={selectedFolderId} />;
  }

  if (activeTab === "notes") {
    return (
      <NoteSection
        noteValue={noteValue}
        handleInput={handleInput}
        handleSaveNote={handleSaveNote}
        noteDivRef={noteDivRef}
        selectedFolderId={selectedFolderId}
      />
    );
  }

  if (activeTab === "flashcards") {
    const hasFlashcards = flashcards.some(
      (f) => f.folderId === selectedFolderId
    );
    if (!hasFlashcards) {
      return <EmptyState type="flashcards" onAction={onAddFlashcard} />;
    }
    return <Flashcards selectedFolderId={selectedFolderId} />;
  }

  return null;
};

export default TabContent;
