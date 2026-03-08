export interface CategoryOutputDTO {
  id: number;
  houseId: number;
  name: string;
  description: string;
  subcategories: Array<SubcategoryOutputDTO>;
}
