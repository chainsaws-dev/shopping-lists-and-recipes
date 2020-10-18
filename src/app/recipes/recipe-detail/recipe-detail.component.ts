import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {

  public CurEditor = DecoupledEditor;

  CurrentRecipe: Recipe;
  id: number;

  LoginSub: Subscription;
  UserAdmin: boolean;

  constructor(
    private RecipeServ: RecipeService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private datastore: DataStorageService,
    private auth: AuthService) { }

  ngOnDestroy(): void {
    this.LoginSub.unsubscribe();
  }

  public onReady(editor) {
    editor.isReadOnly = true;
  }

  ngOnInit(): void {
    this.UserAdmin = false;

    this.UserAdmin = this.auth.CheckIfUserIsAdmin();

    this.LoginSub = this.auth.AuthResultSub.subscribe((loggedin) => {
      this.UserAdmin = this.auth.CheckIfUserIsAdmin();
    });

    this.activeroute.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.CurrentRecipe = this.RecipeServ.GetRecipeById(this.id);
    });
  }

  OnSendToShoppingList(): void {
    this.RecipeServ.SendToShoppingList(this.CurrentRecipe.Ingredients);
    this.RecipeServ.GetShoppingList().forEach(element => {
      this.datastore.SaveShoppingList(element);
    });
  }

  OnDeleteRecipe(): void {
    this.RecipeServ.DeleteRecipe(this.id);

    this.datastore.DeleteRecipe(this.CurrentRecipe);

    this.datastore.DeleteFile(this.CurrentRecipe.ImageDbID, true);

    this.router.navigate(['../'], { relativeTo: this.activeroute, queryParamsHandling: 'preserve' });
  }
}
