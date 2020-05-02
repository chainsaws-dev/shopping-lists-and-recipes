import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  IngredientSelected = new EventEmitter<Ingredient>();
  IngredientChanged = new EventEmitter<Ingredient[]>();

  CurrentSelectedItem: Ingredient;
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() { }

  GetIngredients() {
    return this.ingredients.slice();
  }

  GetIngredientsLength() {
    return this.ingredients.length;
  }

  AddNewItem(NewIngredient: Ingredient) {
    this.ingredients.push(NewIngredient);
    this.IngredientChanged.emit(this.ingredients.slice());
  }

  DeleteSelectedItem() {

    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
    this.IngredientChanged.emit(this.ingredients.slice());
  }

  ClearAll() {
    this.ingredients = [];
    this.CurrentSelectedItem = null;
    this.IngredientChanged.emit(this.ingredients.slice());
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
    this.IngredientSelected.emit(ingredient);
  }

}
