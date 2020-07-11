import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  IngredientSelected = new Subject<Ingredient>();
  IngredientChanged = new Subject<Ingredient[]>();

  CurrentSelectedItem: Ingredient;
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoe', 10)
  ];

  constructor() { }

  GetIngredients() {
    return this.ingredients.slice();
  }

  GetIngredientsLength() {
    return this.ingredients.length;
  }

  AddNewItem(NewIngredient: Ingredient) {
    const FoundIngredient = this.ingredients.find((x) => x.Name === NewIngredient.Name);

    if (FoundIngredient) {
      FoundIngredient.Amount = FoundIngredient.Amount + NewIngredient.Amount;
    } else {
      this.ingredients.push(new Ingredient(NewIngredient.Name, NewIngredient.Amount));
    }

    this.IngredientChanged.next(this.ingredients.slice());
  }

  UpdateSelectedItem(UpdatedIngredient: Ingredient) {
    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients[index] = UpdatedIngredient;
      this.IngredientChanged.next(this.ingredients.slice());
    }
    this.CurrentSelectedItem = null;
  }

  DeleteSelectedItem() {

    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
    this.IngredientChanged.next(this.ingredients.slice());
  }

  ClearAll() {
    this.ingredients = [];
    this.CurrentSelectedItem = null;
    this.IngredientChanged.next(this.ingredients.slice());
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
    this.IngredientSelected.next(ingredient);
  }

  IsCurrentSelected(ingredient: Ingredient) {
    return this.CurrentSelectedItem === ingredient;
  }

}
