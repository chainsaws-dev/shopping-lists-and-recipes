import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe, RecipeResponse, ErrorResponse } from '../recipes/recipe-model';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { ShoppingListResponse } from './ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  LoadingData = new Subject<boolean>();
  RecipesUpdateInsert = new Subject<Recipe>();
  RecivedError = new Subject<ErrorResponse>();

  constructor(private http: HttpClient,
              private recipes: RecipeService,
              private shoppinglist: ShoppingListService) { }

  DeleteRecipe(RecipeToDelete: Recipe) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        RecipeID: RecipeToDelete.ID.toString()
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetRecipesUrl, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        this.RecivedError.next(error);
        this.LoadingData.next(false);
      });
  }

  SaveRecipe(RecipeToSave: Recipe) {
    this.LoadingData.next(true);

    this.http.post<Recipe>(environment.GetSetRecipesUrl, RecipeToSave)
      .subscribe(response => {
        this.RecipesUpdateInsert.next(response);
        this.RecivedError.next(new ErrorResponse(200, 'Данные сохранены'));
        this.LoadingData.next(false);
      }, error => {
        this.RecivedError.next(error);
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

  SearchRecipes(page: number, limit: number, search: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString(),
        Search: search
      })
    };

    return this.http
      .get<RecipeResponse>(environment.SearchRecipesUrl, httpOptions)
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

  FetchShoppingList(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<ShoppingListResponse>(environment.GetSetShoppingListUrl, httpOptions)
      .pipe(tap(recresp => {
        this.shoppinglist.SetIngredients(recresp.Items);
        this.shoppinglist.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
        this.LoadingData.next(false);
      }));
  }
}
