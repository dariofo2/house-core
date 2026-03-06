export interface CookRecipeOutputDTO {
  id: number;
  name: string;
  description: string;
  steps: Array<string>;
  cookRecipeProducts: Array<CookRecipeProductOutputDTO>;
}
