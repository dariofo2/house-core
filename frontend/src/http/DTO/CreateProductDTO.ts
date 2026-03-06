export interface CreateProductDTO {
  subcategoryId: number;
  houseId: number;
  name: string;
  description: string;
  unity: object | null;
  step: number;
  photo: object | null;
  minQuantity: number;
}
