import React, { useState } from "react";
import type { Folder } from "../interfaces";
import { useFolderStore } from "../store/folderStore";
import Breadcrumb from "./Breadcrumb";
import ContentTabs from "./ContentTabs";
import FolderCoverImage from "./FolderCoverImage";
import FolderIconPicker from "./FolderIconPicker";
import type { TabType } from "./TabBar";
import TabContent from "./TabContent";
import Tooltip from "./Tooltip";

const MainContent = () => {
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const folders = useFolderStore((state) => state.folders);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const [editingNote, setEditingNote] = useState(false);
  const [noteValue, setNoteValue] = useState(selectedFolder?.note || "");
  const noteDivRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const iconOptions = [
    "📚",
    "➗",
    "📐",
    "🏛️",
    "⚔️",
    "🧬",
    "📁",
    "⭐",
    "📝",
    "🔬",
    "🌍",
    "🎨",
    "💡",
  ];
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Helper: Build breadcrumb path from root to selected folder
  const getFolderPath = (
    folder: Folder | undefined,
    allFolders: Folder[]
  ): Folder[] => {
    const path: Folder[] = [];
    let current: Folder | undefined = folder;
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        current = allFolders.find((f) => f.id === current!.parentId);
      } else {
        current = undefined;
      }
    }
    return path;
  };

  const breadcrumbPath = getFolderPath(selectedFolder, folders);

  // Keep noteValue in sync with folder change
  React.useEffect(() => {
    setNoteValue(selectedFolder?.note || "");
    setEditingNote(false);
  }, [selectedFolderId]);

  // Focus the contentEditable div when editingNote becomes true
  React.useEffect(() => {
    if (editingNote && noteDivRef.current) {
      noteDivRef.current.focus();
    }
  }, [editingNote]);

  const handleSaveNote = () => {
    if (selectedFolder) {
      updateFolder(selectedFolder.id, { note: noteValue });
      setEditingNote(false);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setNoteValue(e.currentTarget.textContent || "");
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1919] text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1a1919]">
        <Breadcrumb
          breadcrumbPath={breadcrumbPath}
          setSelectedFolderId={setSelectedFolderId}
        />
      </div>
      <div className="flex-1 overflow-auto pb-40">
        {selectedFolder ? (
          <>
            <FolderCoverImage
              coverImage={selectedFolder.coverImage}
              onChangeCoverImage={(coverImage?: string) =>
                updateFolder(selectedFolder.id, { coverImage })
              }
            />
            <div className="max-w-4xl mx-auto">
              <div className="px-8">
                <FolderIconPicker
                  coverImage={selectedFolder.coverImage}
                  iconOptions={iconOptions}
                  selectedIcon={selectedFolder.icon || ""}
                  onSelect={(icon) => updateFolder(selectedFolder.id, { icon })}
                  show={showIconPicker}
                  setShow={setShowIconPicker}
                />
                <h1 className="text-4xl font-bold mt-8 text-[#FFFFFFCF]">
                  {selectedFolder.name}
                </h1>

                <div className="mt-4">
                  <ContentTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    selectedFolderId={selectedFolder.id}
                    onAddFlashcard={() => {
                      // TODO: Implement add flashcard functionality
                    }}
                  />
                  <div className="mt-4">
                    <TabContent
                      activeTab={activeTab}
                      noteValue={noteValue}
                      editingNote={editingNote}
                      setEditingNote={setEditingNote}
                      handleInput={handleInput}
                      handleSaveNote={handleSaveNote}
                      noteDivRef={noteDivRef}
                      selectedFolderId={selectedFolder.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Tooltip
              id="select-folder-tooltip"
              content="Select a folder to view its details"
            >
              <h1 className="text-2xl font-bold mb-4">
                Select a folder to view its details
              </h1>
            </Tooltip>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
