import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  constructor(public ShopListServ: ShoppingListService) { }

  ngOnInit(): void {
  }

  AddNewItem(NameInput: HTMLInputElement, AmountInput: HTMLInputElement): void {
    this.ShopListServ.AddNewItem(new Ingredient(NameInput.value, parseInt(AmountInput.value, 10)));
  }

  DeleteSelectedItem() {
    this.ShopListServ.DeleteSelectedItem();
  }

  ClearAllItems() {
    this.ShopListServ.ClearAll();
  }
}
