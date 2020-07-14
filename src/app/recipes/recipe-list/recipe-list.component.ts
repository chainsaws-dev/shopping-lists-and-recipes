import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Recipe, ErrorResponse } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    private router: Router) {
  }
  ngOnDestroy(): void {
    this.RecipeInsertedSub.unsubscribe();
    this.RecipeUpdatedSub.unsubscribe();
    this.RecipeDeletedSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
    this.FetchOnInint.unsubscribe();
    this.RecivedResponseSub.unsubscribe();
  }

  ngOnInit(): void {
    this.PageSize = environment.RecipePageSize;

    // this.recipes = this.RecServ.GetRecipes();



    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.RecivedResponseSub = this.DataServ.RecivedResponse.subscribe(
      (response) => {
        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => this.ShowMessage = false, 5000);

        switch (response.Error.Code) {
          case 200:
            this.MessageType = 'success';
            break;
          default:
            this.MessageType = 'danger';
            break;
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
      }
    );

    this.activeroute.params.subscribe((params: Params) => {
      this.currentPage = +params.pn;
      this.RecServ.CurrentPage = this.currentPage;

      this.activeroute.queryParams.subscribe((Qparams: Params) => {
        this.SearchRequest = Qparams.search;

        if (this.SearchRequest) {
          this.FetchOnInint = this.DataServ.SearchRecipes(this.currentPage, environment.RecipePageSize, this.SearchRequest).subscribe(
            () => {
              this.recipes = this.RecServ.GetRecipes();
              this.collectionSize = this.RecServ.Total;
            }
          );
        } else {
          this.FetchOnInint = this.DataServ.FetchRecipes(this.currentPage, environment.RecipePageSize).subscribe(
            () => {
              this.recipes = this.RecServ.GetRecipes();
              this.collectionSize = this.RecServ.Total;
            }
          );
        }
      }
      );
    });
  }

  OnPageChanged(page: number) {
    this.RecServ.CurrentPage = page;
    this.FetchOnInint.unsubscribe();
    if (this.SearchRequest) {
      this.FetchOnInint = this.DataServ.SearchRecipes(page, environment.RecipePageSize, this.SearchRequest).subscribe(
        () => {
          this.recipes = this.RecServ.GetRecipes();
          this.collectionSize = this.RecServ.Total;
          this.router.navigate(['recipes', page.toString()], { queryParamsHandling: 'preserve' });
        }
      );
    } else {
      this.FetchOnInint = this.DataServ.FetchRecipes(page, environment.RecipePageSize).subscribe(
        () => {
          this.recipes = this.RecServ.GetRecipes();
          this.collectionSize = this.RecServ.Total;
          this.router.navigate(['recipes', page.toString()]);
        }
      );
    }
  }
}
