import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe-model';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
 
  constructor(private http: HttpClient,
              private recipes: RecipeService) { }

  SaveRecipes() {
    const recipeslocal = this.recipes.GetRecipes();
    this.http.put(environment.GetSetDataUrl + environment.RecipesUrl, recipeslocal)
      .subscribe(response => {
        console.log(response);
      });
  }

  FetchRecipes() {
    return this.http
      .get<Recipe[]>(environment.GetSetDataUrl + environment.RecipesUrl)
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
