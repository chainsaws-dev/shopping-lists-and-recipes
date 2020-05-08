import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingchanged: Subscription;
  constructor(public ShopListServ: ShoppingListService) { }

  ngOnDestroy(): void {
    this.ingchanged.unsubscribe();
  }

  ngOnInit(): void {
    this.ingredients = this.ShopListServ.GetIngredients();
    this.ingchanged = this.ShopListServ.IngredientChanged
      .subscribe((ing: Ingredient[]) => {
        this.ingredients = ing;
      });
  }
}
