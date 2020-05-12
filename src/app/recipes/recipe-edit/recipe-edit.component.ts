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
  ingredientedit = false;


  constructor(private activatedroute: ActivatedRoute, private recipeservice: RecipeService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params.id != null;
        if (this.editmode) {
          this.index = +params.id;
          this.RecipeToEdit = this.recipeservice.GetRecipeById(this.index);
        } else {
          const NewIngList: Ingredient[] = [];
          this.RecipeToEdit = new Recipe('', '', '', NewIngList);
        }
        this.recipeservice.RecipeToEdit = this.RecipeToEdit;
      }
    );
  }

  onAddNewIngredient(NameInput: HTMLInputElement, AmountInput: HTMLInputElement) {
    const NewIngredient = new Ingredient(NameInput.value, parseInt(AmountInput.value, 10));

    this.recipeservice.AddNewIngredient(NewIngredient);
  }

  onEditIngredient(NameInput: HTMLInputElement, AmountInput: HTMLInputElement) {
    const NewIngredient = new Ingredient(NameInput.value, parseInt(AmountInput.value, 10));

    this.recipeservice.UpdateSelectedIngredient(NewIngredient);
  }

  onDeleteSelectedIngredient() {
    this.recipeservice.DeleteSelectedIngredient();
  }

  GetIngredientsLength() {
    return this.recipeservice.GetIngredientsLength();
  }

  OnIngredientSelect(ingredient: Ingredient) {
    this.recipeservice.IngredientSelect(ingredient);
    this.CurrentSelectedItem = ingredient;
    this.ingredientedit = true;
  }

  onClearAllIngredients() {
    this.recipeservice.ClearAllIngredients();
  }

  onFileInput(Event) {
    this.recipeservice.FileInput(Event);
  }

  OnSaveClick(RecipeName: string, RecipeDescription: string) {

    this.RecipeToEdit.name = RecipeName;
    this.RecipeToEdit.description = RecipeDescription;

    if (this.editmode) {
      this.recipeservice.UpdateExistingRecipe(this.RecipeToEdit, this.index);
    } else {
      this.recipeservice.AddNewRecipe(this.RecipeToEdit);
    }
  }

}
