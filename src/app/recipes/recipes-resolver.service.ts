import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe, Pagination } from './recipe-model';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private datastorageservice: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

    const searchreq = route.queryParams.search;
    const page = route.params.pn;

    if (!searchreq) {
      return this.datastorageservice.FetchRecipes(page, environment.RecipePageSize).pipe(
        map(resp => {
          this.datastorageservice.LastPagination = new Pagination(resp.Total, resp.Limit, resp.Offset);
          return resp.Recipes;
        }));
    } else {
      return this.datastorageservice.SearchRecipes(page, environment.RecipePageSize, searchreq).pipe(
        map(resp => {
          this.datastorageservice.LastPagination = new Pagination(resp.Total, resp.Limit, resp.Offset);
          this.datastorageservice.Searched = true;
          return resp.Recipes;
        }));
    }
  }
}
