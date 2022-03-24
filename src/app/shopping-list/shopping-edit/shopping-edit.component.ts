import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/shared.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

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

  private IngUpd: Subscription;
  private IngAdd: Subscription;
  private IngDel: Subscription;
  private IngCle: Subscription;

  constructor(
    public ShopListServ: ShoppingListService,
    private DataServ: DataStorageService,
    public translate: TranslateService,
    private sitetitle: Title
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
   }

  ngOnInit(): void {
    
    const ulang = localStorage.getItem("userLang")

    if (ulang!==null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }  

    this.ingselected = this.ShopListServ.IngredientSelected.subscribe(
      (ing: Ingredient) => {
        this.selectedingredient = ing;
        this.editmode = true;
        this.slEditForm.setValue({
          name: this.selectedingredient.Name,
          amount: this.selectedingredient.Amount
        });
      });

    this.IngAdd = this.ShopListServ.IngredientAdded.subscribe(
      (addedIng) => {
        this.DataServ.SaveShoppingList(addedIng);
      }
    );
    this.IngUpd = this.ShopListServ.IngredientUpdated.subscribe(
      (updIng) => {
        this.DataServ.SaveShoppingList(updIng);
      }
    );
    this.IngDel = this.ShopListServ.IngredientDeleted.subscribe(
      (delIng) => {
        this.DataServ.DeleteShoppingList(delIng);
      }
    );
    this.IngCle = this.ShopListServ.IngredientClear.subscribe(
      () => {
        this.DataServ.DeleteAllShoppingList();
      }
    );
  }

  ngOnDestroy(): void {
    this.ingselected.unsubscribe();
    this.IngAdd.unsubscribe();
    this.IngUpd.unsubscribe();
    this.IngDel.unsubscribe();
    this.IngCle.unsubscribe();
  }

  AddNewItem(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.ShopListServ.AddNewItem(new Ingredient(fvalue.name, parseInt(fvalue.amount, 10)), false);
    }
  }

  UpdateItem(form: NgForm): void {
    if (form.valid) {
      const fvalue = form.value;
      this.ShopListServ.UpdateSelectedItem(new Ingredient(fvalue.name, parseInt(fvalue.amount, 10)));

      this.editmode = false;
      this.slEditForm.reset();
    }
  }

  DeleteSelectedItem() {
    this.ShopListServ.DeleteSelectedItem();
  }

  ClearAllItems() {
    this.ShopListServ.ClearAll();
  }

  SwitchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem("userLang", lang)

    this.translate.get("WebsiteTitleText", lang).subscribe(
      {
        next: (titletext: string) => {
          this.sitetitle.setTitle(titletext);
        },
        error: error => {
          console.log(error);
        }
      }
    );
  }
}
