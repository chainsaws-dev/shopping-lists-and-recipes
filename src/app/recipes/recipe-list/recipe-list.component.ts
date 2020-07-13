import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Recipe } from '../recipe-model';
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
  }

  ngOnInit(): void {
    this.PageSize = environment.RecipePageSize;

    // this.recipes = this.RecServ.GetRecipes();

    this.activeroute.params.subscribe((params: Params) => {
      this.currentPage = +params.pn;
    });

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );


    this.FetchOnInint = this.DataServ.FetchRecipes(1, environment.RecipePageSize).subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
        this.collectionSize = this.RecServ.Total;
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

  }

  OnPageChanged(page: number) {
    this.FetchOnInint.unsubscribe();
    this.FetchOnInint = this.DataServ.FetchRecipes(page, environment.RecipePageSize).subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
        this.collectionSize = this.RecServ.Total;
        this.router.navigate(['../', page.toString()], { relativeTo: this.activeroute });
      }
    );
  }
}
