import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

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

  constructor(public ShopListServ: ShoppingListService, private DataServ: DataStorageService) { }

  ngOnInit(): void {
    this.ingselected = this.ShopListServ.IngredientSelected.subscribe(
      (ing: Ingredient) => {
        this.selectedingredient = ing;
        this.editmode = true;
        this.slEditForm.setValue({
          name: this.selectedingredient.Name,
          amount: this.selectedingredient.Amount
        });
      });
  }

  ngOnDestroy(): void {
    this.ingselected.unsubscribe();
  }

  AddNewItem(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.DataServ.SaveShoppingList(this.ShopListServ.AddNewItem(new Ingredient(fvalue.name, parseInt(fvalue.amount, 10))));
    }
  }

  UpdateItem(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      const newing = new Ingredient(fvalue.name, parseInt(fvalue.amount, 10));
      this.ShopListServ.UpdateSelectedItem(newing);
      this.DataServ.SaveShoppingList(newing);

      this.editmode = false;
      this.slEditForm.reset();
    }
  }

  DeleteSelectedItem() {
    const deling = this.ShopListServ.DeleteSelectedItem();
    this.DataServ.DeleteShoppingList(deling);
  }

  ClearAllItems() {
    this.ShopListServ.ClearAll();
  }
}
