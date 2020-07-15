import { Ingredient } from '../shared/ingredients.model';

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


export class ErrorResponse {

  public Error: BackendError;

  constructor(Code: number, Message: string) {
    this.Error = new BackendError(Code, Message);
  }
}

export class BackendError {

  public Code: number;
  public Message: string;

  constructor(Code: number, Message: string) {
    this.Code = Code;
    this.Message = Message;
  }
}
