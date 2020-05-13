import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];

  constructor(private RecServ: RecipeService) {
  }
  ngOnDestroy(): void {
    this.RecServ.RecipeDeleted.unsubscribe();
  }

  ngOnInit(): void {
    this.recipes = this.RecServ.GetRecipes();
    this.RecServ.RecipeDeleted.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
   );
  }
}
