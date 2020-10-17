import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  IngredientSelected = new Subject<Ingredient>();
  IngredientChanged = new Subject<Ingredient[]>();
  IngredientsUpdated = new Subject<void>();
  IngredientAdded = new Subject<Ingredient>();
  IngredientUpdated = new Subject<Ingredient>();
  IngredientDeleted = new Subject<Ingredient>();
  IngredientClear = new Subject<void>();

  CurrentSelectedItem: Ingredient;
  Total: number;

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

  AddNewItem(NewIngredient: Ingredient, Force: boolean) {
    let FoundIngredient = this.ingredients.find((x) => x.Name === NewIngredient.Name);

    if (FoundIngredient) {
      FoundIngredient.Amount = FoundIngredient.Amount + NewIngredient.Amount;
    } else {
      FoundIngredient = NewIngredient;
      if (this.ingredients.length < environment.ShoppingListPageSize || Force) {
        this.ingredients.push(new Ingredient(NewIngredient.Name, NewIngredient.Amount));
      }
    }

    this.IngredientAdded.next(FoundIngredient);
    this.IngredientChanged.next(this.ingredients.slice());
  }

  UpdateSelectedItem(UpdatedIngredient: Ingredient) {
    let FoundIngredient = this.ingredients.find((x) => x.Name === UpdatedIngredient.Name);

    if (FoundIngredient && FoundIngredient !== this.CurrentSelectedItem) {
      FoundIngredient.Name = UpdatedIngredient.Name;
      FoundIngredient.Amount = FoundIngredient.Amount + UpdatedIngredient.Amount;
      this.DeleteSelectedItem();
    } else {
      const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
      if (index !== -1) {
        this.ingredients[index] = UpdatedIngredient;
        this.IngredientChanged.next(this.ingredients.slice());
      }
      FoundIngredient = this.CurrentSelectedItem;
    }

    this.IngredientUpdated.next(FoundIngredient);
    this.CurrentSelectedItem = null;
  }

  DeleteSelectedItem() {

    const index: number = this.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }

    this.IngredientDeleted.next(this.CurrentSelectedItem);
    this.IngredientChanged.next(this.ingredients.slice());
    this.CurrentSelectedItem = null;

  }

  ClearAll() {
    this.ingredients = [];
    this.CurrentSelectedItem = null;
    this.IngredientChanged.next(this.ingredients.slice());
    this.SetPagination(0, 0, 0);
    this.IngredientClear.next();
  }

  SelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
    this.IngredientSelected.next(ingredient);
  }

  IsCurrentSelected(ingredient: Ingredient) {
    return this.CurrentSelectedItem === ingredient;
  }

}
