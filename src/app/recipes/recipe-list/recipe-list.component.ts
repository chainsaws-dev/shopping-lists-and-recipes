import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  RecipeDeletedSub: Subscription;

  constructor(private RecServ: RecipeService) {
  }
  ngOnDestroy(): void {
    this.RecipeDeletedSub.unsubscribe();
  }

  ngOnInit(): void {
    this.recipes = this.RecServ.GetRecipes();
    this.RecipeDeletedSub = this.RecServ.RecipeDeleted.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );
  }
}
