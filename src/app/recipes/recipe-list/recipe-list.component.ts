import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  RecipeDeletedSub: Subscription;
  DataServiceSub: Subscription;
  FetchOnInint: Subscription;
  IsLoading = false;


  constructor(private RecServ: RecipeService, private DataServ: DataStorageService) {
  }
  ngOnDestroy(): void {
    this.RecipeDeletedSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {

    this.RecipeDeletedSub = this.RecServ.RecipesUpdated.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.FetchOnInint = this.DataServ.FetchRecipes().subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );


  }
}
