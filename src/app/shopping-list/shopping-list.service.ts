import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  IngredientSelected = new Subject<Ingredient>();
  IngredientChanged = new Subject<Ingredient[]>();
  IngredientsUpdated = new Subject<void>();

  CurrentSelectedItem: Ingredient;
  Total: number;

  // new Ingredient('Apple', 5), new Ingredient('Tomatoe', 10)
  private ingredients: Ingredient[] = [];

  constructor() { }

  GetIngredients() {
    return this.ingredients.slice();
  }

  GetIngredientsLength() {
    return this.ingredients.length;
  }

  SetIngredients(newing: Ingredient[]) {
    this.ingredients = newing;
    this.IngredientsUpdated.next();
  }

  SetPagination(Total: number, Limit: number, Offset: number) {
    this.Total = Total;
  }

  AddNewItem(NewIngredient: Ingredient) {
    let FoundIngredient = this.ingredients.find((x) => x.Name === NewIngredient.Name);

    if (FoundIngredient) {
      FoundIngredient.Amount = FoundIngredient.Amount + NewIngredient.Amount;
    } else {
      FoundIngredient = NewIngredient;
      if (this.ingredients.length <= environment.ShoppingListPageSize) {
        this.ingredients.push(new Ingredient(NewIngredient.Name, NewIngredient.Amount));
      }
    }

    this.IngredientChanged.next(this.ingredients.slice());
    return FoundIngredient;
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

    const todel = new Ingredient(this.CurrentSelectedItem.Name, this.CurrentSelectedItem.Amount);

    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
    this.IngredientChanged.next(this.ingredients.slice());

    return todel;

  }

  ClearAll() {
    this.ingredients = [];
    this.CurrentSelectedItem = null;
    this.IngredientChanged.next(this.ingredients.slice());
    this.SetPagination(0, 0, 0);
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
    this.IngredientSelected.next(ingredient);
  }

  IsCurrentSelected(ingredient: Ingredient) {
    return this.CurrentSelectedItem === ingredient;
  }

}
