import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/shared.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';
import { environment } from 'src/environments/environment';
import { ErrorResponse } from '../shared/shared.model';

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

  slCurrentPage: number;
  slPageSize: number;
  slcollectionSize: number;
  IsLoading: boolean;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;
  RecivedErrorSub: Subscription;

  private WatchIngAdd: Subscription;
  private WatchIngDel: Subscription;
  private WatchIngCle: Subscription;

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
    this.WatchIngAdd.unsubscribe();
    this.WatchIngDel.unsubscribe();
    this.WatchIngCle.unsubscribe();
  }

  ngOnInit(): void {

    this.slPageSize = environment.ShoppingListPageSize;

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
      this.slCurrentPage = +params.pn;
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.FetchOnInint = this.DataServ.FetchShoppingList(this.slCurrentPage, environment.ShoppingListPageSize).subscribe(
      (value) => {
        this.ingredients = this.ShopListServ.GetIngredients();
        this.slcollectionSize = this.ShopListServ.Total;
      },
      (error) => {
        this.ingredients = [];
      }
    );

    this.WatchIngAdd = this.ShopListServ.IngredientAdded.subscribe(
      (newing) => {
        this.slcollectionSize += 1;
        this.ingredients = this.ShopListServ.GetIngredients();
      }
    );
    this.WatchIngDel = this.ShopListServ.IngredientDeleted.subscribe(
      (deling) => {
        this.slcollectionSize -= 1;
        this.ingredients = this.ShopListServ.GetIngredients();
        if (this.ingredients.length === 0) {
          this.slCurrentPage = this.GetPreviousPage(this.slCurrentPage);
          this.ShopListServ.Total = this.slcollectionSize;
          if (this.slcollectionSize !== 0) {
            this.OnPageChanged(this.slCurrentPage);
          }
        }
      }
    );

    this.WatchIngCle = this.ShopListServ.IngredientClear.subscribe(
      () => {
        this.slcollectionSize = 0;
        this.ShopListServ.Total = this.slcollectionSize;
      }
    );
  }

  GetPreviousPage(page: number) {
    if (page > 1) {
      return page - 1;
    } else {
      return 1;
    }
  }

  OnPageChanged(page: number) {
    this.slCurrentPage = page;
    this.FetchOnInint = this.DataServ.FetchShoppingList(page, environment.ShoppingListPageSize).subscribe(
      () => {
        this.ingredients = this.ShopListServ.GetIngredients();
        this.router.navigate(['../', page.toString()], { relativeTo: this.activeroute });
      }
    );
  }

}
