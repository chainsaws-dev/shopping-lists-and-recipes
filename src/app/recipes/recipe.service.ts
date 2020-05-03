import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe-model';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  RecipeSelected = new EventEmitter<Recipe>();

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
      [new Ingredient('Apple', 12), new Ingredient('Orange', 32), new Ingredient('Pineapple', 2)]),];

  constructor(private ShopList: ShoppingListService) { }

  GetRecipes() {
    return this.recipes.slice();
  }

  SendToShoppingList(RecipeIngredients: Ingredient[]) {
    RecipeIngredients.forEach(element => {
      this.ShopList.AddNewItem(element);
    });

  }
}
