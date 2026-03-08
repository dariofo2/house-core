import ProductListView from '@/views/user/house/view/products/ProductList';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductListView houseId={parseInt(id)} />;
}
