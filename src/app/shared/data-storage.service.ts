import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe, RecipeResponse } from '../recipes/recipe-model';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  LoadingData = new Subject<boolean>();

  constructor(private http: HttpClient,
              private recipes: RecipeService) { }

  SaveRecipe(RecipeToSave: Recipe) {
    this.LoadingData.next(true);

    this.http.post<Recipe>(environment.GetSetRecipesUrl, RecipeToSave)
      .subscribe(response => {
         this.LoadingData.next(false);
      });
  }

  FetchRecipes(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
         Page: page.toString(),
         Limit: limit.toString()
      })
    };

    return this.http
      .get<RecipeResponse>(environment.GetSetRecipesUrl, httpOptions)
      .pipe(map(recresp => {
        recresp.Recipes = recresp.Recipes.map(recipe => {
          return { ...recipe, Ingredients: recipe.Ingredients ? recipe.Ingredients : [] };
        });

        return recresp;
      }),
        tap(recresp => {
          this.recipes.SetRecipes(recresp.Recipes);
          this.recipes.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
          this.LoadingData.next(false);
        }));
  }
}
