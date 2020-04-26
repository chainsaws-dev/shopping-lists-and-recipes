import { Component, OnInit, Input } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  CurrentSelectedItem: Ingredient;

  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  OnAddedNewItem(NewIngredient: Ingredient) {
    this.ingredients.push(NewIngredient);
  }

  OnDeletedSelectedItem(IngredientToDelete: Ingredient) {

    const index: number = this.ingredients.indexOf(IngredientToDelete);
    if (index !== -1) {
      this.ingredients.splice(index, 1);
    }
  }

  OnClearedAll() {
    this.ingredients = [];
  }

  OnSelectItemShopList(ingredient: Ingredient) {
    this.CurrentSelectedItem = ingredient;
  }

}
