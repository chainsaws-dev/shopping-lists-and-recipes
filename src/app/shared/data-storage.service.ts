import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpEventType } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe, RecipeResponse, ErrorResponse, Pagination, FileUploadResponse } from '../recipes/recipe-model';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { ShoppingListResponse, Ingredient } from './ingredients.model';
import { UsersResponse, User } from '../admin/admin.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AdminService } from '../admin/admin.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  LoadingData = new Subject<boolean>();
  RecipesUpdateInsert = new Subject<Recipe>();
  RecivedError = new Subject<ErrorResponse>();
  PaginationSet = new Subject<Pagination>();
  FileUploadProgress = new Subject<string>();
  FileUploaded = new Subject<FileUploadResponse>();
  UserUpdateInsert = new Subject<User>();

  LastPagination: Pagination;

  constructor(
    private http: HttpClient,
    private recipes: RecipeService,
    private shoppinglist: ShoppingListService,
    private users: AdminService) { }

  FetchRecipes(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<RecipeResponse>(environment.GetSetRecipesUrl + '?key=' + environment.ApiKey, httpOptions)
      .pipe(map(recresp => {
        recresp.Recipes = recresp.Recipes.map(recipe => {
          return { ...recipe, Ingredients: recipe.Ingredients ? recipe.Ingredients : [] };
        });

        return recresp;
      }),
        tap(recresp => {
          this.recipes.SetRecipes(recresp.Recipes);
          this.PaginationSet.next(new Pagination(recresp.Total, recresp.Limit, recresp.Offset));
          this.LoadingData.next(false);
        }, (error) => {
          const errresp = error.error as ErrorResponse;
          this.RecivedError.next(errresp);
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
      .get<RecipeResponse>(environment.SearchRecipesUrl + '?key=' + environment.ApiKey, httpOptions)
      .pipe(map(recresp => {
        recresp.Recipes = recresp.Recipes.map(recipe => {
          return { ...recipe, Ingredients: recipe.Ingredients ? recipe.Ingredients : [] };
        });

        return recresp;
      }),
        tap(recresp => {
          this.recipes.SetRecipes(recresp.Recipes);
          this.PaginationSet.next(new Pagination(recresp.Total, recresp.Limit, recresp.Offset));
          this.LoadingData.next(false);
        }, (error) => {
          const errresp = error.error as ErrorResponse;
          this.RecivedError.next(errresp);
          this.LoadingData.next(false);
        }));
  }

  SaveRecipe(RecipeToSave: Recipe) {
    this.LoadingData.next(true);

    this.http.post<Recipe>(environment.GetSetRecipesUrl + '?key=' + environment.ApiKey, RecipeToSave)
      .subscribe(response => {
        this.RecipesUpdateInsert.next(response);
        this.RecivedError.next(new ErrorResponse(200, 'Данные сохранены'));
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  FileUpload(FileToUpload: File) {
    const formdatafile = new FormData();
    formdatafile.append('image', FileToUpload, FileToUpload.name);
    this.http.post(environment.UploadFileUrl + '?key=' + environment.ApiKey, formdatafile, {
      reportProgress: true,
      observe: 'events'
    }).subscribe((curevent: any) => {
      if (curevent.type === HttpEventType.UploadProgress) {
        this.FileUploadProgress.next(String(curevent.loaded / curevent.total * 100));
      } else if (curevent.type === HttpEventType.Response) {
        if (curevent.ok) {
          this.FileUploaded.next(curevent.body as FileUploadResponse);
        }
      }
    }, error => {
      const errresp = error.error as ErrorResponse;
      this.RecivedError.next(errresp);
      this.LoadingData.next(false);
    }
    );
  }

  DeleteRecipe(RecipeToDelete: Recipe) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        RecipeID: RecipeToDelete.ID.toString()
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetRecipesUrl + '?key=' + environment.ApiKey, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
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
      .get<ShoppingListResponse>(environment.GetSetShoppingListUrl + '?key=' + environment.ApiKey, httpOptions)
      .pipe(tap(recresp => {
        this.shoppinglist.SetIngredients(recresp.Items);
        this.shoppinglist.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
        this.LoadingData.next(false);
      }, (error) => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      }));
  }

  SaveShoppingList(ItemToSave: Ingredient) {
    this.LoadingData.next(true);

    this.http.post<Recipe>(environment.GetSetShoppingListUrl + '?key=' + environment.ApiKey, ItemToSave)
      .subscribe(response => {
        this.RecipesUpdateInsert.next(response);
        this.RecivedError.next(new ErrorResponse(200, 'Данные сохранены'));
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  DeleteShoppingList(IngredientToDelete: Ingredient) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        IngName: encodeURI(IngredientToDelete.Name)
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetShoppingListUrl + '?key=' + environment.ApiKey, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  DeleteAllShoppingList() {
    this.http.delete<ErrorResponse>(environment.GetSetShoppingListUrl + '?key=' + environment.ApiKey)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  FetchUsersList(page: number, limit: number) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Page: page.toString(),
        Limit: limit.toString()
      })
    };

    return this.http
      .get<UsersResponse>(environment.GetSetUsersUrl + '?key=' + environment.ApiKey, httpOptions)
      .pipe(tap(recresp => {
        this.users.SetUsers(recresp.Users);
        this.users.SetPagination(recresp.Total, recresp.Limit, recresp.Offset);
        this.LoadingData.next(false);
      }, (error) => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      }));
  }

  SaveUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    this.LoadingData.next(true);

    if (ItemToSave.GUID.length === 0) {
      ItemToSave.GUID = '00000000-0000-0000-0000-000000000000';
    }

    this.GetObsForSaveUser(ItemToSave, ChangePassword, NewPassword)
      .subscribe(response => {
        this.UserUpdateInsert.next(response);
        this.RecivedError.next(new ErrorResponse(200, 'Данные сохранены'));
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  GetObsForSaveUser(ItemToSave: User, ChangePassword: boolean, NewPassword: string) {
    if (ChangePassword) {
      const httpOptions = {
        headers: new HttpHeaders({
          NewPassword: btoa(encodeURI(NewPassword))
        })
      };

      return this.http.post<User>(environment.GetSetUsersUrl + '?key=' + environment.ApiKey, ItemToSave, httpOptions);
    } else {
      return this.http.post<User>(environment.GetSetUsersUrl + '?key=' + environment.ApiKey, ItemToSave);
    }
  }

  DeleteUser(UserToDelete: User) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        UserID: btoa(encodeURI(UserToDelete.GUID))
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetUsersUrl + '?key=' + environment.ApiKey, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

}



