export interface UpdateCookRecipeDTO {
  id: number;
  name: string;
  description: string;
  steps: Array<string>;
  photo: string | null;
}
