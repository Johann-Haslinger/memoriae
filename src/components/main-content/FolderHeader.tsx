import React, { useState } from "react";
import type { Folder } from "../../interfaces";
import AddCoverImageButton from "./AddCoverImageButton";
import FolderCoverImage from "./FolderCoverImage";
import FolderIconPicker from "./FolderIconPicker";

interface FolderHeaderProps {
  folder: Folder;
  onUpdateFolder: (folderId: string, updates: Partial<Folder>) => void;
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
  folder,
  onUpdateFolder,
}) => {
  const [showIconPicker, setShowIconPicker] = useState(false);

  return (
    <>
      <FolderCoverImage
        coverImage={folder.coverImage}
        onChangeCoverImage={(coverImage?: string) =>
          onUpdateFolder(folder.id, { coverImage })
        }
      />
      <div className={`max-w-4xl mx-auto ${folder.coverImage ? "" : "mt-28"}`}>
        <div className="px-8">
          <FolderIconPicker
            selectedIcon={folder.icon || ""}
            onSelect={(icon) => onUpdateFolder(folder.id, { icon })}
            show={showIconPicker}
            setShow={setShowIconPicker}
          />
          <div className="mt-2">
            {!folder.coverImage ? (
              <AddCoverImageButton
                onCoverImageSelected={(coverImage) =>
                  onUpdateFolder(folder.id, { coverImage })
                }
              />
            ) : (
              <div className="h-10" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-[#FFFFFFCF]">{folder.name}</h1>
        </div>
      </div>
    </>
  );
};
