import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  IngredientSelected = new EventEmitter<Ingredient>();
  CurrentSelectedItem: Ingredient;
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() { }

  GetIngredients() {
    return this.ingredients.slice();
  }

  AddNewItem(NewIngredient: Ingredient) {
    this.ingredients.push(NewIngredient);
  }

  DeleteSelectedItem() {

    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
  }

  ClearAll() {
    this.ingredients = [];
    this.CurrentSelectedItem = null;
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
    this.IngredientSelected.emit(ingredient);
  }

}
