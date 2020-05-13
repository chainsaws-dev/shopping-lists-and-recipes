import { Injectable, } from '@angular/core';
import { Recipe } from './recipe-model';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  RecipeToEdit: Recipe;
  CurrentSelectedItem: Ingredient;
  IngredientSelected = new Subject<Ingredient>();
  RecipeChanged = new Subject<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Test recipe #1',
      'This is for test #1',
      'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg',
      [new Ingredient('Apple', 12), new Ingredient('Orange', 32), new Ingredient('Pineapple', 2)]),
    new Recipe('Test recipe #2',
      'This is for test #2',
      'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg',
      [new Ingredient('Apple', 12), new Ingredient('Orange', 32), new Ingredient('Pineapple', 2)]),
    new Recipe('Test recipe #3',
      'This is for test #3',
      'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg',
      [new Ingredient('Apple', 12), new Ingredient('Orange', 32), new Ingredient('Pineapple', 2)]),
    new Recipe('Test recipe #4',
      'This is for test #4',
      'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg',
      [new Ingredient('Apple', 12), new Ingredient('Orange', 32), new Ingredient('Pineapple', 2)])];

  constructor(private ShopList: ShoppingListService) { }

  GetRecipes() {
    return this.recipes.slice();
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

  AddNewRecipe(NewRecipe: Recipe) {
    const NewRecipeToAdd = new Recipe(NewRecipe.name, NewRecipe.description, NewRecipe.imagePath, NewRecipe.ingredients)
    this.recipes.push(NewRecipeToAdd);
    this.RecipeChanged.next(NewRecipeToAdd);
  }

  UpdateExistingRecipe(RecipeToUpdate: Recipe, Index: number) {
    this.recipes[Index] = RecipeToUpdate;
    this.RecipeChanged.next(RecipeToUpdate);
  }

  DeleteRecipe(RecipeToDelete: Recipe, Index: number) {
    this.recipes.splice(Index, 1);
    this.RecipeChanged.next(RecipeToDelete);
  }

  AddNewIngredient(NewIngredient: Ingredient) {
    const FoundIngredient = this.RecipeToEdit.ingredients.find((x) => x.name === NewIngredient.name);

    if (FoundIngredient) {
      FoundIngredient.amount = FoundIngredient.amount + NewIngredient.amount;
    } else {
      this.RecipeToEdit.ingredients.push(new Ingredient(NewIngredient.name, NewIngredient.amount));
    }
  }

  UpdateSelectedIngredient(UpdatedIngredient: Ingredient) {
    const FoundIngredient = this.RecipeToEdit.ingredients.find((x) => x.name === UpdatedIngredient.name);
    if (FoundIngredient) {
      FoundIngredient.name = UpdatedIngredient.name;
      FoundIngredient.amount = UpdatedIngredient.amount;
    }

    this.CurrentSelectedItem = null;
    this.IngredientSelected.next(this.CurrentSelectedItem);
  }

  DeleteSelectedIngredient() {
    const index: number = this.RecipeToEdit.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.RecipeToEdit.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
  }

  ClearAllIngredients() {
    this.RecipeToEdit.ingredients = [];
    this.CurrentSelectedItem = null;
  }

  GetIngredientsLength(): number {
    return this.RecipeToEdit.ingredients.length;
  }

  IngredientSelect(SelectedIngredient: Ingredient) {
    this.CurrentSelectedItem = SelectedIngredient;
    this.IngredientSelected.next(SelectedIngredient);
  }

}
