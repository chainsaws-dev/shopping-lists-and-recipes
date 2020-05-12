import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slEditForm: NgForm;
  private ingselected: Subscription;
  selectedingredient: Ingredient;
  editmode = false;

  constructor(public ShopListServ: ShoppingListService) { }

  ngOnInit(): void {
    this.ingselected = this.ShopListServ.IngredientSelected.subscribe(
      (ing: Ingredient) => {
        this.selectedingredient = ing;
        this.editmode = true;
        this.slEditForm.setValue({
          name: this.selectedingredient.name,
          amount: this.selectedingredient.amount
        });
      });
  }

  ngOnDestroy(): void {
    this.ingselected.unsubscribe();
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
