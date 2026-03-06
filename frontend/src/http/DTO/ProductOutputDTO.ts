export interface ProductOutputDTO {
  id: number;
  subcategoryId: number;
  name: string;
  unity: object | null;
  step: number;
  photo: object | null;
  minQuantity: number;
  createdAt: string;
  updatedAt: string;
  productBatches: Array<ProductBatchOutputDTO>;
}
