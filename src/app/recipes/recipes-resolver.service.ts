import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe-model';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private datastorageservice: DataStorageService,
              private recipeservice: RecipeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipeswegot = this.recipeservice.GetRecipes();

    console.log(route.outlet);

    if (recipeswegot.length === 0) {
      return this.datastorageservice.FetchRecipes(route.params.pn, environment.RecipePageSize).pipe(map(resp => {
        return resp.Recipes;
      }));
    } else {
      return recipeswegot;
    }

  }

}
