import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe-model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  /* Replace with API URL */
  private MainURL = '';
  constructor(private http: HttpClient, private recipes: RecipeService) { }

  SaveRecipes() {
    const recipeslocal = this.recipes.GetRecipes();
    this.http.put(this.MainURL + 'recipes.json', recipeslocal)
      .subscribe(response => {
        console.log(response);
      });
  }

  FetchRecipes() {
    return this.http
      .get<Recipe[]>(this.MainURL + 'recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap(recipes => {
        this.recipes.SetRecipes(recipes);
      }));
  }
}
