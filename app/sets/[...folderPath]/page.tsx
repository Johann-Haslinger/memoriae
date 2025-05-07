export default async function SetsPage({ params }: { params: { folderPath?: string[] } }) {
  const path = params.folderPath ?? []; // ['folderA', 'folderB', ...]

  return (
    <div>
      <h1>📁 {path.join(" / ") || "Root"}</h1>

      <ul></ul>
    </div>
  );
}
