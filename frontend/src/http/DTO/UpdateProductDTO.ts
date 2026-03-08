export interface UpdateProductDTO {
  id: number;
  name: string;
  description: string;
  unity: string | null;
  step: number;
  photo: string | null;
  minQuantity: number;
}
