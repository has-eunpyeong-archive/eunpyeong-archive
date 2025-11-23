import ArchiveDetailComponent from "./ArchiveDetailComponent";

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ArchiveDetailComponent id={id} />;
}
