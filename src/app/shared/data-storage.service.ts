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

  Searched: boolean;

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
        Limit: limit.toString(),
        ApiKey: environment.ApiKey
      })
    };

    return this.http
      .get<RecipeResponse>(environment.GetSetRecipesUrl , httpOptions)
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
        Search: search,
        ApiKey: environment.ApiKey
      })
    };

    return this.http
      .get<RecipeResponse>(environment.SearchRecipesUrl , httpOptions)
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

    const httpOptions = {
      headers: new HttpHeaders({
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<Recipe>(environment.GetSetRecipesUrl, RecipeToSave, httpOptions)
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
    this.http.post(environment.UploadFileUrl, formdatafile, {
      headers: new HttpHeaders({
        ApiKey: environment.ApiKey
      }),
      reportProgress: true,
      observe: 'events'}).subscribe((curevent: any) => {
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
        RecipeID: RecipeToDelete.ID.toString(),
        ApiKey: environment.ApiKey
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetRecipesUrl , httpOptions)
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
        Limit: limit.toString(),
        ApiKey: environment.ApiKey
      })
    };

    return this.http
      .get<ShoppingListResponse>(environment.GetSetShoppingListUrl , httpOptions)
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


    const httpOptions = {
      headers: new HttpHeaders({
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<Recipe>(environment.GetSetShoppingListUrl, ItemToSave, httpOptions)
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
        IngName: encodeURI(IngredientToDelete.Name),
        ApiKey: environment.ApiKey
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetShoppingListUrl , httpOptions)
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

    const httpOptions = {
      headers: new HttpHeaders({
        ApiKey: environment.ApiKey
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetShoppingListUrl, httpOptions)
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
        Limit: limit.toString(),
        ApiKey: environment.ApiKey
      })
    };

    return this.http
      .get<UsersResponse>(environment.GetSetUsersUrl, httpOptions)
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
          NewPassword: btoa(encodeURI(NewPassword)),
          ApiKey: environment.ApiKey
        })
      };

      return this.http.post<User>(environment.GetSetUsersUrl, ItemToSave, httpOptions);
    } else {

      const httpOptions = {
        headers: new HttpHeaders({
          ApiKey: environment.ApiKey
        })
      };

      return this.http.post<User>(environment.GetSetUsersUrl, ItemToSave, httpOptions);
    }
  }

  DeleteUser(UserToDelete: User) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        UserID: btoa(encodeURI(UserToDelete.GUID)),
        ApiKey: environment.ApiKey
      })
    };

    this.http.delete<ErrorResponse>(environment.GetSetUsersUrl , httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }


  ConfirmEmail(UniqueToken: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Token: UniqueToken,
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<ErrorResponse>(environment.ConfirmEmailUrl, null, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  SendEmailConfirmEmail(EmailToSend: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Email: EmailToSend,
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<ErrorResponse>(environment.ResendEmailUrl, null, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  SendEmailResetPassword(EmailToSend: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Email: EmailToSend,
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<ErrorResponse>(environment.SendEmailResetPassUrl, null, httpOptions)
      .subscribe(response => {
        this.RecivedError.next(response);
        this.LoadingData.next(false);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.RecivedError.next(errresp);
        this.LoadingData.next(false);
      });
  }

  SubmitNewPassword(UniqueToken: string, NewPass: string) {
    this.LoadingData.next(true);

    const httpOptions = {
      headers: new HttpHeaders({
        Token: UniqueToken,
        NewPassword: btoa(encodeURI(NewPass)),
        ApiKey: environment.ApiKey
      })
    };

    this.http.post<ErrorResponse>(environment.ResetPasswordUrl, null, httpOptions)
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



