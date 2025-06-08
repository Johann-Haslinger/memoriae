import { useEffect } from "react";
import { useFolderTab } from "../../hooks/useFolderTab";
import { useNote } from "../../hooks/useNote";
import type { Folder } from "../../interfaces";
import { useFlashcardStore } from "../../store/flashcardStore";
import { useFolderStore } from "../../store/folderStore";
import AddFolderButton from "./AddFolderButton";
import Breadcrumb from "./Breadcrumb";
import ContentTabs from "./ContentTabs";
import FolderGrid from "./FolderGrid";
import { FolderHeader } from "./FolderHeader";
import TabContent from "./TabContent";

const MainContent = () => {
  const selectedFolderId = useFolderStore((state) => state.selectedFolderId);
  const folders = useFolderStore((state) => state.folders);
  const updateFolder = useFolderStore((state) => state.updateFolder);
  const setSelectedFolderId = useFolderStore(
    (state) => state.setSelectedFolderId
  );
  const fetchFolders = useFolderStore((state) => state.fetchFolders);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);
  const flashcards = useFlashcardStore((state) => state.flashcards);

  const { activeTab, setActiveTab } = useFolderTab(
    selectedFolderId,
    selectedFolder,
    folders
  );

  const { noteValue, noteDivRef, handleSaveNote, handleInput } = useNote({
    selectedFolder,
    selectedFolderId,
    onUpdateFolder: updateFolder,
  });

  // Fetch folders when component mounts and when selectedFolderId changes
  useEffect(() => {
    fetchFolders();
  }, [selectedFolderId, fetchFolders]);

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

  return (
    <main className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1919] text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1a1919]">
        <Breadcrumb
          breadcrumbPath={breadcrumbPath}
          setSelectedFolderId={setSelectedFolderId}
        />
      </div>
      <div className="flex-1 overflow-auto pb-40 scrollable">
        {selectedFolder ? (
          <>
            <FolderHeader
              folder={selectedFolder}
              onUpdateFolder={updateFolder}
            />
            <div className="max-w-4xl mx-auto">
              <div className="px-8">
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
                      handleInput={handleInput}
                      handleSaveNote={handleSaveNote}
                      noteDivRef={noteDivRef}
                      selectedFolderId={selectedFolder.id}
                      onAddFlashcard={() => {
                        // TODO: Implement add flashcard functionality
                      }}
                      folders={folders}
                      flashcards={flashcards}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl pt-20 font-bold text-[#FFFFFFCF]">
                Home
              </h1>
              <AddFolderButton
                parentId={null}
                activeTab="content"
                type="subject"
              />
            </div>
            <FolderGrid parentId={null} />
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
