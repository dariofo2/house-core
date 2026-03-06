import HouseView from '@/views/user/house/view/HouseView';

export default async function HouseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return <HouseView id={parseInt(id)} />;
}
