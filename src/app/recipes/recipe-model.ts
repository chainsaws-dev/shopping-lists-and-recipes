import { Ingredient } from '../shared/ingredients.model';

export class Recipe {
  public id: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}

export class RecipeResponse {
  public Recipes: Recipe[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}


