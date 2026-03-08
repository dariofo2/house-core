import UserListView from '@/views/user/house/view/users/UserList';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserListView houseId={parseInt(id)} />;
}
