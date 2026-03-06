export interface UpdateProductDTO {
  id: number;
  name: string;
  description: string;
  unity: object | null;
  step: number;
  photo: object | null;
  minQuantity: number;
}
