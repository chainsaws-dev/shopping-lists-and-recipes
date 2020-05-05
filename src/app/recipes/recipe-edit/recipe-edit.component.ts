import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Ingredient } from 'src/app/shared/ingredients.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  RecipeToEdit: Recipe;
  index: number;
  editmode = false;
  CurrentSelectedItem: Ingredient;


  constructor(private activatedroute: ActivatedRoute, public recipeservice: RecipeService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params.id != null;
        if (this.editmode) {
          this.index = +params.id;
          this.RecipeToEdit = this.recipeservice.GetRecipeById(this.index);
        }
      }
    );
  }

  onFileInput($event) {
    // Реализовать загрузку файла на сервер http запросом
  }

  AddNewItem(NameInput: HTMLInputElement, AmountInput: HTMLInputElement): void {

    const NewIngredient = new Ingredient(NameInput.value, parseInt(AmountInput.value, 10));

    const FoundIngredient = this.RecipeToEdit.ingredients.find((x) => x.name === NewIngredient.name);

    if (FoundIngredient) {
      FoundIngredient.amount = FoundIngredient.amount + NewIngredient.amount;
    } else {
      this.RecipeToEdit.ingredients.push(new Ingredient(NewIngredient.name, NewIngredient.amount));
    }
  }

  DeleteSelectedItem() {
    const index: number = this.RecipeToEdit.ingredients.indexOf(this.CurrentSelectedItem);
    if (index !== -1) {
      this.RecipeToEdit.ingredients.splice(index, 1);
    }

    this.CurrentSelectedItem = null;
  }

  ClearAllItems() {
    this.RecipeToEdit.ingredients = [];
    this.CurrentSelectedItem = null;
  }

  GetIngredientsLength(): number {
    return this.RecipeToEdit.ingredients.length;
  }

  OnIngredientSelect(SelectedIngredient: Ingredient) {
    this.CurrentSelectedItem = SelectedIngredient;
  }

}
