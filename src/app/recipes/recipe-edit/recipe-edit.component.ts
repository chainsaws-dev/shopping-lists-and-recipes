import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/shared.model';
import { FiLe } from '../../admin/media/media.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/ru';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingrform', { static: false })
  IngredientsForm!: NgForm;
  @ViewChild('RecipeForm', { static: false })
  RecipeForm!: NgForm;

  HtmlEditor = DecoupledEditor;

  RecipeToEdit!: Recipe;
  index!: number;
  editmode = false;
  CurrentSelectedItem!: Ingredient;
  ingredientedit = false;
  CurPercentStyle = 'width: 0%';

  RecipeChangedSub!: Subscription;
  IngredientSelectedSub!: Subscription;
  DatabaseUpdated!: Subscription;
  FileProgress!: Subscription;
  FileUploaded!: Subscription;

  FilesToCleanOnCancel: number[] = [];
  FilesToCleanOnSave: number[] = [];

  constructor(
    private activatedroute: ActivatedRoute,
    private recipeservice: RecipeService,
    private router: Router,
    private datastore: DataStorageService,
    public translate: TranslateService,
    private sitetitle: Title
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
   }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnDestroy(): void {
    this.RecipeChangedSub.unsubscribe();
    this.IngredientSelectedSub.unsubscribe();
    this.DatabaseUpdated.unsubscribe();
    this.FileProgress.unsubscribe();
    this.FileUploaded.unsubscribe();
  }

  ngOnInit(): void {

    const ulang = localStorage.getItem("userLang")

    if (ulang!==null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    }

    this.DatabaseUpdated = this.datastore.RecipesUpdateInsert.subscribe((recipe) => {

      if (this.editmode) {
        this.RecipeToEdit = recipe;
        this.recipeservice.UpdateExistingRecipe(this.RecipeToEdit, this.index);
      } else {
        this.RecipeToEdit = recipe;
        this.recipeservice.AddNewRecipe(this.RecipeToEdit);
      }

      if (this.FilesToCleanOnSave.length > 0) {
        this.FilesToCleanOnSave.forEach((FileID: number) => {
          this.datastore.DeleteFile(FileID, true);
        });
      }

      this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' });
    });

    this.activatedroute.params.subscribe(
      (params: Params) => {
        this.editmode = params['id'] != null;
        if (this.editmode) {
          this.index = +params['id'];
          this.RecipeToEdit = this.recipeservice.GetRecipeById(this.index);
        } else {
          const NewIngList: Ingredient[] = [];
          this.RecipeToEdit = new Recipe('', '', '', NewIngList, 0, 0);
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

    this.FileProgress = this.datastore.FileUploadProgress.subscribe(
      (pr: string) => {
        this.CurPercentStyle = 'width: ' + pr + '%';
      }
    );

    this.FileUploaded = this.datastore.FileUploaded.subscribe(
      (res: FiLe) => {

        this.FilesToCleanOnCancel.push(res.ID);

        if (this.RecipeToEdit.ImageDbID > 1) {
          this.FilesToCleanOnSave.push(this.RecipeToEdit.ImageDbID);
        }

        this.RecipeToEdit.ImagePath = res.FileID;
        this.RecipeToEdit.ImageDbID = res.ID;
      }
    );
  }

  onDiscardChanges() {
    if (this.FilesToCleanOnCancel.length > 0) {
      this.FilesToCleanOnCancel.forEach((FileID: number) => {
        this.datastore.DeleteFile(FileID, true);
      });
    }

    this.router.navigate(['../'], { relativeTo: this.activatedroute, queryParamsHandling: 'merge' });
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

  onFileInput(event: any) {
    this.CurPercentStyle = 'width: 0%';
    const FileToUpload = event.target.files[0] as File;
    this.datastore.FileUpload(FileToUpload);
  }

  OnSaveClick(SubmittedForm: NgForm) {
    if (SubmittedForm.valid) {
      this.RecipeToEdit.Name = SubmittedForm.value.recipename;
      this.RecipeToEdit.Description = SubmittedForm.value.recipedescription;

      this.datastore.SaveRecipe(this.RecipeToEdit);
    }
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
