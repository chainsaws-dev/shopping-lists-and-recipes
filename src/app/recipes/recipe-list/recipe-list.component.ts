import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Recipe } from '../recipe-model';
import { ErrorResponse } from '../../shared/shared.model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  RecipeInsertedSub: Subscription;
  RecipeUpdatedSub: Subscription;
  RecipeDeletedSub: Subscription;
  DataServiceSub: Subscription;
  FetchOnInint: Subscription;
  PaginationUpd: Subscription;

  RecivedErrorSub: Subscription;
  RecivedResponseSub: Subscription;
  ResponseFromBackend: ErrorResponse;
  ShowMessage: boolean;
  MessageType: string;

  SearchRequest: string;

  IsLoading = false;

  PageSize: number;
  collectionSize: number;
  currentPage: number;

  constructor(
    private RecServ: RecipeService,
    private DataServ: DataStorageService,
    private activeroute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
    translate.addLangs(environment.SupportedLangs);
    translate.setDefaultLang(environment.DefaultLocale);
  }
  ngOnDestroy(): void {
    this.RecipeInsertedSub.unsubscribe();
    this.RecipeUpdatedSub.unsubscribe();
    this.RecipeDeletedSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
    if (this.FetchOnInint) {
      this.FetchOnInint.unsubscribe();
    }
    this.RecivedErrorSub.unsubscribe();
    this.PaginationUpd.unsubscribe();
  }

  ngOnInit(): void {
    const ulang = localStorage.getItem("userLang")

    if (ulang!==null) {
      this.SwitchLanguage(ulang)
    } else {
      this.SwitchLanguage(environment.DefaultLocale)
    } 

    this.PageSize = environment.RecipePageSize;
    this.collectionSize = this.DataServ.LastPagination.Total;

    this.PaginationUpd = this.DataServ.PaginationSet.subscribe(
      (NewPagination) => {
        this.collectionSize = NewPagination.Total;
      }
    );

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => this.ShowMessage = false, 5000);

        if (response) {
          switch (response.Error.Code) {
            case 200:
              this.MessageType = 'success';
              break;
            default:
              this.MessageType = 'danger';
              break;
          }
        }
      }
    );

    this.RecipeUpdatedSub = this.RecServ.RecipesUpdated.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );

    this.RecipeInsertedSub = this.RecServ.RecipesInserted.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
        this.collectionSize = this.collectionSize + 1;
      }
    );

    this.RecipeDeletedSub = this.RecServ.RecipesDeleted.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
        this.collectionSize = this.collectionSize - 1;
        if (this.recipes.length === 0) {
          this.currentPage = this.GetPreviousPage(this.currentPage);
          this.DataServ.LastPagination.Total = this.collectionSize;
          if (this.collectionSize !== 0) {
            this.OnPageChanged(this.currentPage);
          }
        }
      }
    );

    this.activeroute.params.subscribe((params: Params) => {
      this.currentPage = +params.pn;
      this.RecServ.CurrentPage = this.currentPage;

      this.activeroute.queryParams.subscribe((Qparams: Params) => {
        this.SearchRequest = Qparams.search;

        this.StartFetch(this.currentPage);

      }
      );
    });
  }

  GetPreviousPage(page: number) {
    if (page > 1) {
      return page - 1;
    } else {
      return 1;
    }
  }

  OnPageChanged(page: number) {
    this.RecServ.CurrentPage = page;
    this.NavigatePage(page);
  }

  NavigatePage(page: number) {
    if (this.SearchRequest) {
      this.router.navigate(['recipes', page.toString()], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['recipes', page.toString()]);
    }
  }

  StartFetch(page: number) {

    if (this.SearchRequest && !this.DataServ.Searched) {
      this.FetchOnInint = this.DataServ.SearchRecipes(page, environment.RecipePageSize, this.SearchRequest).subscribe(
        (value) => {
          this.recipes = this.RecServ.GetRecipes();
        },
        (error) => {
          this.recipes = [];
        }
      );
    } else {
      this.recipes = this.RecServ.GetRecipes();
    }

    if (this.DataServ.Searched) {
      this.DataServ.Searched = false;
    }
  }

SwitchLanguage(lang: string) {
  this.translate.use(lang);
  localStorage.setItem("userLang", lang)
}
}
