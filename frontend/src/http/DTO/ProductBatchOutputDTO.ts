export interface ProductBatchOutputDTO {
  id: number;
  productId: number;
  quantity: number;
  expirationDate: string | null;
  createdAt: string;
  updatedAt: string;
}
