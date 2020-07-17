import { Injectable, } from '@angular/core';
import { Recipe, Pagination } from './recipe-model';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  RecipeToEdit: Recipe;
  CurrentSelectedItem: Ingredient;
  IngredientSelected = new Subject<Ingredient>();
  RecipeChanged = new Subject<Recipe>();
  RecipesUpdated = new Subject<void>();
  RecipesInserted = new Subject<void>();
  RecipesDeleted = new Subject<void>();
  CurrentPage: number;

  // new Recipe('Test', 'Desc', '', [new Ingredient('Bread', 1)])
  private recipes: Recipe[] = [];

  constructor(private ShopList: ShoppingListService) { }

  GetRecipes() {
    return this.recipes.slice(0, environment.RecipePageSize);
  }

  GetRecipesLen() {
    return this.recipes.length;
  }

  GetRecipeById(id: number) {
    if (id < this.recipes.length && id > 0) {
      return this.recipes[id];
    } else {
      return this.recipes[0];
    }
  }

  GetRecipeId(recipe: Recipe): number {
    return this.recipes.indexOf(recipe);
  }

  SendToShoppingList(RecipeIngredients: Ingredient[]) {
    RecipeIngredients.forEach(element => {
      this.ShopList.AddNewItem(element);
    });
  }

  GetShoppingList() {
    return this.ShopList.GetIngredients();
  }

  AddNewRecipe(NewRecipe: Recipe) {

    const NewRecipeToAdd = new Recipe(NewRecipe.Name, NewRecipe.Description,
      NewRecipe.ImagePath, NewRecipe.Ingredients, NewRecipe.ImageDbID, NewRecipe.ID);

    if (this.recipes.length <= environment.RecipePageSize) {
      this.recipes.push(NewRecipeToAdd);
    }

    this.RecipeChanged.next(NewRecipeToAdd);
    this.RecipesInserted.next();
  }

  UpdateExistingRecipe(RecipeToUpdate: Recipe, Index: number) {
    this.recipes[Index] = RecipeToUpdate;
    this.RecipeChanged.next(RecipeToUpdate);
  }

  SetRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.RecipesUpdated.next();
  }

  DeleteRecipe(Index: number) {
    this.recipes.splice(Index, 1);
    this.RecipesDeleted.next();
  }

  AddNewIngredient(NewIngredient: Ingredient) {
    const FoundIngredient = this.RecipeToEdit.Ingredients.find((x) => x.Name === NewIngredient.Name);

    if (FoundIngredient) {
      FoundIngredient.Amount = FoundIngredient.Amount + NewIngredient.Amount;
    } else {
      this.RecipeToEdit.Ingredients.push(new Ingredient(NewIngredient.Name, NewIngredient.Amount));
    }
  }

  UpdateSelectedIngredient(UpdatedIngredient: Ingredient) {

    const FoundIngredient = this.RecipeToEdit.Ingredients.find((x) => x.Name === UpdatedIngredient.Name);

    if (FoundIngredient && FoundIngredient !== this.CurrentSelectedItem) {
      FoundIngredient.Name = UpdatedIngredient.Name;
      FoundIngredient.Amount = FoundIngredient.Amount + UpdatedIngredient.Amount;
      this.DeleteSelectedIngredient();
    } else {
      const FoundExact = this.RecipeToEdit.Ingredients.find((x) => x === this.CurrentSelectedItem);
      if (FoundExact) {
        FoundExact.Name = UpdatedIngredient.Name;
        FoundExact.Amount = UpdatedIngredient.Amount;
      }
    }

    this.CurrentSelectedItem = null;
    this.IngredientSelected.next(this.CurrentSelectedItem);
  }

  DeleteSelectedIngredient() {
    const index: number = this.RecipeToEdit.Ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.RecipeToEdit.Ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
  }

  ClearAllIngredients() {
    this.RecipeToEdit.Ingredients = [];
    this.CurrentSelectedItem = null;
  }

  GetIngredientsLength(): number {
    return this.RecipeToEdit.Ingredients.length;
  }

  IngredientSelect(SelectedIngredient: Ingredient) {
    this.CurrentSelectedItem = SelectedIngredient;
    this.IngredientSelected.next(SelectedIngredient);
  }

}
