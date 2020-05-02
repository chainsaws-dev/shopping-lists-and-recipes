import { Component, OnInit, Input } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  constructor(public ShopListServ: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.ShopListServ.GetIngredients();
    this.ShopListServ.IngredientChanged
    .subscribe((ing: Ingredient[]) => {
      this.ingredients = ing;
    });
  }
}
