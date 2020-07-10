import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  RecipeDeletedSub: Subscription;
  DataServiceSub: Subscription;
  FetchOnInint: Subscription;
  IsLoading = false;

  collectionSize: number;
  pageSize = 4;
  currentPage: number;

  constructor(
    private RecServ: RecipeService,
    private DataServ: DataStorageService,
    private activeroute: ActivatedRoute,
    private router: Router) {
  }
  ngOnDestroy(): void {
    this.RecipeDeletedSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {
    this.activeroute.params.subscribe((params: Params) => {
      this.currentPage = +params.pn;
    });

    this.RecipeDeletedSub = this.RecServ.RecipesUpdated.subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.FetchOnInint = this.DataServ.FetchRecipes(1).subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
      }
    );
  }

  OnPageChanged(page: number) {
    this.FetchOnInint.unsubscribe();
    this.FetchOnInint = this.DataServ.FetchRecipes(page).subscribe(
      () => {
        this.recipes = this.RecServ.GetRecipes();
        //this.router.navigate(page.toString())
      }
    );
  }
}
