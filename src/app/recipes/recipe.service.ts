import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './recipe-model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  RecipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('Test recipe #1', 'This is for test #1', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #2', 'This is for test #2', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #3', 'This is for test #3', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #4', 'This is for test #4', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg'),
    new Recipe('Test recipe #5', 'This is for test #5', 'https://www.inspiredtaste.net/wp-content/uploads/2018/12/Sauteed-Zucchini-Recipe-1-1200.jpg')
  ];
  constructor() { }

  GetRecipes() {
    return this.recipes.slice();
  }
}
