import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public CurEditor = DecoupledEditor;
  CurrentRecipe: Recipe;
  id: number;
  constructor(private RecipeServ: RecipeService, private activeroute: ActivatedRoute, private router: Router) { }

  public onReady(editor) {
      editor.isReadOnly = true;
  }

  ngOnInit(): void {
    this.activeroute.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.CurrentRecipe = this.RecipeServ.GetRecipeById(this.id);
    });
  }

  OnSendToShoppingList(): void {
    this.RecipeServ.SendToShoppingList(this.CurrentRecipe.Ingredients);
  }

  OnDeleteRecipe(): void {
    this.RecipeServ.DeleteRecipe(this.id);
    this.router.navigate(['../'], { relativeTo: this.activeroute });
  }
}
