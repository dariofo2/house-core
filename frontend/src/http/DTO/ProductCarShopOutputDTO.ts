export interface ProductCarShopOutputDTO {
  id: number;
  name: string;
  description: string;
  unity: string;
  step: number;
  photo?: string | null;
  minQuantity: number;
  quantity: number;
}
