import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe-model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {
  SelectedRecipe: Recipe;
  ShowRecipeDetails: false;
  constructor(private RecServ: RecipeService) { }

  ngOnInit(): void {
    this.RecServ.RecipeSelected
      .subscribe((recipe: Recipe) => this.SelectedRecipe = recipe);
  }

}
