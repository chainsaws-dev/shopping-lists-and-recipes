import { Injectable, OnDestroy } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe-model';
import { Observable, Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>, OnDestroy {
  RecipesGet: Subscription;
  constructor(
    private datastorageservice: DataStorageService,
    private recipeservice: RecipeService) { }

  ngOnDestroy() {
    if (this.RecipesGet) {
      this.RecipesGet.unsubscribe();
    }
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

    const searchreq = route.queryParams.search;

    const page = route.params.pn;

    if (!searchreq) {
      this.RecipesGet = this.datastorageservice.FetchRecipes(page, environment.RecipePageSize).subscribe(
        (value) => {
          return this.recipeservice.GetRecipes();
        },
        (error) => {
          return [];
        }
      );
    } else {
      this.RecipesGet = this.datastorageservice.SearchRecipes(page, environment.RecipePageSize, searchreq).subscribe(
        (value) => {
          return this.recipeservice.GetRecipes();
        },
        (error) => {
          return [];
        }
      );
    }

    return [];

  }

}
