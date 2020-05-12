import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  constructor(public ShopListServ: ShoppingListService) { }

  ngOnInit(): void {
  }

  AddNewItem(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.ShopListServ.AddNewItem(new Ingredient(fvalue.name, parseInt(fvalue.amount, 10)));
    }
  }

  DeleteSelectedItem() {
    this.ShopListServ.DeleteSelectedItem();
  }

  ClearAllItems() {
    this.ShopListServ.ClearAll();
  }
}
