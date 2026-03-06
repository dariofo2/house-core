import EventListView from '@/views/user/house/view/events/EventList';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventListView houseId={parseInt(id)} />;
}
