import RecipeListView from '@/views/user/house/view/cook-recipes/RecipeList';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecipeListView houseId={parseInt(id)} />;
}
