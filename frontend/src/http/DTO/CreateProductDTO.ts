export interface CreateProductDTO {
  subcategoryId: number;
  houseId: number;
  name: string;
  description: string;
  unity: string | null;
  step: number;
  photo: string | null;
  minQuantity: number;
}
