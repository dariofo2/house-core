export interface CreateCookRecipeDTO {
  houseId: number;
  name: string;
  description: string;
  steps: Array<string>;
}
