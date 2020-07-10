import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe-model';
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

  SaveRecipes(RecipeToSave: Recipe) {
    this.LoadingData.next(true);

    this.http.put(environment.GetSetDataUrl + environment.RecipesUrl, RecipeToSave)
      .subscribe(response => {
        this.LoadingData.next(false);
      });
  }

  FetchRecipes(page: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
         Page: page.toString(),
      })
    };

    return this.http
      .get<Recipe[]>(environment.GetSetDataUrl + environment.RecipesUrl, httpOptions)
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
        tap(recipes => {
          this.recipes.SetRecipes(recipes);
          this.LoadingData.next(false);
        }));
  }
}
