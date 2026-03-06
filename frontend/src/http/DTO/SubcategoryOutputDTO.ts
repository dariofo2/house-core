export interface SubcategoryOutputDTO {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  products: Array<ProductOutputDTO>;
}
