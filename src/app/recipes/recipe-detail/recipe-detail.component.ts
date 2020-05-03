import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe-model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() CurrentRecipe: Recipe;
  constructor(private RecipeServ: RecipeService) { }

  ngOnInit(): void {
  }

  OnSendToShoppingList(): void {
    this.RecipeServ.SendToShoppingList(this.CurrentRecipe.ingredients);
  }
}
