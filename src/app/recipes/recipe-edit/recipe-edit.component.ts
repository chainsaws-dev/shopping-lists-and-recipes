import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { Subscription } from 'rxjs';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingrform', { static: false }) IngredientsForm: NgForm;
  @ViewChild('RecipeForm', { static: false }) RecipeForm: NgForm;

  HtmlEditor = DecoupledEditor;
  RecipeToEdit: Recipe;
  index: number;
  editmode = false;
  CurrentSelectedItem: Ingredient;
  ingredientedit = false;
  CurPercentStyle = 'width: 0%';
  UploadError = '';

  RecipeChangedSub: Subscription;
  IngredientSelectedSub: Subscription;


  constructor(private activatedroute: ActivatedRoute,
              private recipeservice: RecipeService,
              private httpClient: HttpClient,
              private router: Router,
              private datastore: DataStorageService) { }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnDestroy(): void {
    this.RecipeChangedSub.unsubscribe();
    this.IngredientSelectedSub.unsubscribe();
  }

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

    this.RecipeChangedSub = this.recipeservice.RecipeChanged.subscribe((SelRecipe: Recipe) => {
      this.RecipeForm.setValue({
        recipename: SelRecipe.Name,
        recipedescription: SelRecipe.Description
      });
    });

    this.IngredientSelectedSub = this.recipeservice.IngredientSelected.subscribe((SelIng: Ingredient) => {
      this.CurrentSelectedItem = SelIng;
      this.ingredientedit = true;
      if (SelIng) {
        this.IngredientsForm.setValue({
          ingredientname: SelIng.Name,
          ingredientamount: SelIng.Amount
        });
      } else {
        this.IngredientsForm.reset();
      }
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
      ingredientname: ingredient.Name,
      ingredientamount: ingredient.Amount
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
            this.RecipeToEdit.ImagePath = '/uploads/' + curevent.body.FileID;
            this.RecipeToEdit.ImageDbID = curevent.body.DbID;
            this.UploadError = curevent.body.Error;
        }
      }
    }
    );
  }

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {
      this.RecipeToEdit.Name = SubmittedForm.value.recipename;
      this.RecipeToEdit.Description = SubmittedForm.value.recipedescription;

      if (this.editmode) {
        this.recipeservice.UpdateExistingRecipe(this.RecipeToEdit, this.index);
      } else {
          this.recipeservice.AddNewRecipe(this.RecipeToEdit);
      }

      this.datastore.SaveRecipe(this.RecipeToEdit);

      this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' });
    }
  }

}
