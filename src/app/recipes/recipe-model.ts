import { Ingredient } from '../shared/ingredients.model';

export class Recipe {
  public ID: number;
  public Name: string;
  public Description: string;
  public ImagePath: string;
  public ImageDbID: number;
  public Ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.Name = name;
    this.Description = desc;
    this.ImagePath = imagePath;
    this.Ingredients = ingredients;
  }
}

export class RecipeResponse {
  public Recipes: Recipe[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}


export class ErrorResponse {
  public Error: BackendError;
}

export class BackendError {
  public Code: number;
  public Message: string;
}
