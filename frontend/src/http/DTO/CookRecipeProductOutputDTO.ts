export interface CookRecipeProductOutputDTO {
  id: number;
  cookRecipeId: number;
  productId: number;
  products: Array<ProductOutputDTO>;
}
