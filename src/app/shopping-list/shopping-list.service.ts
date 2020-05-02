import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ItemsCount: number;
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
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
  }

}
