import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe-model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() RecipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('Test recipe #1', 'This is for test #1', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #2', 'This is for test #2', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #3', 'This is for test #3', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #4', 'This is for test #4', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #5', 'This is for test #5', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg')
  ];

  constructor() { }

  ngOnInit(): void {

  }
  OnRecipeSelected(SelectedRecipe: Recipe) {
    this.RecipeWasSelected.emit(SelectedRecipe);
  }
}
