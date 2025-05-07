import FolderView from "../../components/folder/FolderView";

export default async function SetsPage({ params }: { params: { folderPath?: string[] } }) {
  const path = params.folderPath ?? []; // ['folderA', 'folderB', ...]

  return (
    <div>
      <FolderView folderId={path[path.length - 1] || ""} />
    </div>
  );
}
