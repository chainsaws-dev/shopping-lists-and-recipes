import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  @ViewChild('ingrform', { static: false }) IngredientsForm: NgForm;
  @ViewChild('RecipeForm', { static: false }) RecipeForm: NgForm;

  RecipeToEdit: Recipe;
  index: number;
  editmode = false;
  CurrentSelectedItem: Ingredient;
  ingredientedit = false;
  CurPercentStyle = 'width: 0%';
  dbid: number;
  UploadError = '';


  constructor(private activatedroute: ActivatedRoute,
    private recipeservice: RecipeService,
    private httpClient: HttpClient) { }

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

    this.recipeservice.RecipeChanged.subscribe((SelRecipe: Recipe) => {
      this.RecipeForm.setValue({
        recipename: SelRecipe.name,
        recipedescription: SelRecipe.description
      });
    });

    this.recipeservice.IngredientSelected.subscribe((SelIng: Ingredient) => {
      this.CurrentSelectedItem = SelIng;
      this.ingredientedit = true;
      this.IngredientsForm.setValue({
        ingredientname: SelIng.name,
        ingredientamount: SelIng.amount
      });
    });
  }

  onAddNewIngredient(form: NgForm) {
    if (form.valid) {
      const fvalue = form.value;

      const NewIngredient = new Ingredient(fvalue.ingredientname, parseInt(fvalue.ingredientamount, 10));

      this.recipeservice.AddNewIngredient(NewIngredient);
    }
  }

  onEditIngredient(form: NgForm) {
    if (form.valid) {

      const fvalue = form.value;

      const NewIngredient = new Ingredient(fvalue.ingredientname, parseInt(fvalue.ingredientamount, 10));

      this.recipeservice.UpdateSelectedIngredient(NewIngredient);

      this.IngredientsForm.reset();

      this.ingredientedit = false;
    }
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

    this.IngredientsForm.setValue({
      ingredientname: ingredient.name,
      ingredientamount: ingredient.amount
    });
  }

  onClearAllIngredients() {
    this.recipeservice.ClearAllIngredients();
  }

  onFileInput(event) {
    this.CurPercentStyle = 'width: 0%';
    const FileToUpload = event.target.files[0] as File;
    const formdatafile = new FormData();
    formdatafile.append('image', FileToUpload, FileToUpload.name);
    this.httpClient.post('/api/SaveRecipePhoto', formdatafile, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((curevent: any) => {
      if (curevent.type === HttpEventType.UploadProgress) {
        this.CurPercentStyle = 'width: ' + String(curevent.loaded / curevent.total * 100) + '%';
      } else if (curevent.type === HttpEventType.Response) {
        if (curevent.ok) {
          curevent.body.forEach(element => {
            this.RecipeToEdit.imagePath = '/uploads/' + element.id;
            this.dbid = element.db_id;
            this.UploadError = element.error;
          });

        }
      }
    }
    );
  }

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {
      this.RecipeToEdit.name = SubmittedForm.value.recipename;
      this.RecipeToEdit.description = SubmittedForm.value.recipedescription;

      if (this.editmode) {
        this.recipeservice.UpdateExistingRecipe(this.RecipeToEdit, this.index);
      } else {
        this.recipeservice.AddNewRecipe(this.RecipeToEdit);
      }
    }
  }

}
