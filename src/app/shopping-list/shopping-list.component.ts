import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { environment } from 'src/environments/environment';
import { ErrorResponse } from '../recipes/recipe-model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private IngChanged: Subscription;
  private PageChanged: Subscription;
  private FetchOnInint: Subscription;
  private DataLoading: Subscription;

  CurrentPage: number;
  PageSize: number;
  collectionSize: number;
  IsLoading: boolean;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;
  RecivedErrorSub: Subscription;

  constructor(
    public ShopListServ: ShoppingListService,
    private activeroute: ActivatedRoute,
    private DataServ: DataStorageService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.IngChanged.unsubscribe();
    this.PageChanged.unsubscribe();
    this.FetchOnInint.unsubscribe();
    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();
  }

  ngOnInit(): void {

    this.PageSize = environment.ShoppingListPageSize;

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
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

    this.IngChanged = this.ShopListServ.IngredientChanged
      .subscribe((ing: Ingredient[]) => {
        this.ingredients = ing;
      });

    this.PageChanged = this.activeroute.params.subscribe((params: Params) => {
      this.CurrentPage = +params.pn;
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.FetchOnInint = this.DataServ.FetchShoppingList(this.CurrentPage, environment.RecipePageSize).subscribe(
      (value) => {
        this.ingredients = this.ShopListServ.GetIngredients();
        this.collectionSize = this.ShopListServ.Total;
      },
      (error) => {
        this.ingredients = [];
      }
    );
  }

  OnPageChanged(page: number) {
    this.CurrentPage = page;
    this.FetchOnInint = this.DataServ.FetchShoppingList(page, environment.RecipePageSize).subscribe(
      () => {
        this.ingredients = this.ShopListServ.GetIngredients();
        this.collectionSize = this.ShopListServ.Total;
        this.router.navigate(['../', page.toString()], { relativeTo: this.activeroute });
      }
    );
  }

}
