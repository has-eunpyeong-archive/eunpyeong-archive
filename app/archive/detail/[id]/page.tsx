
import ArchiveDetailComponent from './ArchiveDetailComponent';

export default function ArchiveDetailPage({ params }: { params: { id: string } }) {
  return <ArchiveDetailComponent id={params.id} />;
}
