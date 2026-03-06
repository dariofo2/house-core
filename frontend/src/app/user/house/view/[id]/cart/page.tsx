import CartView from '@/views/user/house/view/cart/CartView';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CartView houseId={parseInt(id)} />;
}
