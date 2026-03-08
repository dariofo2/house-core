export interface CookRecipeProductOutputDTO {
  id: number;
  cookRecipeId: number;
  productId: number;
  quantity: number;
  product: ProductOutputDTO;
}
