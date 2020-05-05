import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  CurrentRecipe: Recipe;
  constructor(private RecipeServ: RecipeService, private activeroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeroute.params.subscribe((params: Params) => { this.CurrentRecipe = this.RecipeServ.GetRecipeById(params.id); });
  }

  OnSendToShoppingList(): void {
    this.RecipeServ.SendToShoppingList(this.CurrentRecipe.ingredients);
  }
}
