import { Ingredient } from '../shared/shared.model';

export class Recipe {
  public ID: number;
  public Name: string;
  public Description: string;
  public ImagePath: string;
  public ImageDbID: number;
  public Ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[], ImageDBID: number, ID: number) {
    this.Name = name;
    this.Description = desc;
    this.ImagePath = imagePath;
    this.Ingredients = ingredients;
    this.ImageDbID = ImageDBID;
    this.ID = ID;
  }
}

export class RecipeResponse {
  public Recipes: Recipe[];
  public Total: number;
  public Offset: number;
  public Limit: number;
}


