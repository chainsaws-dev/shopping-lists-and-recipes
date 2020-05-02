import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe-model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
@Input() recipe: Recipe;

  constructor(private RecServ: RecipeService) { }

  ngOnInit(): void {
  }

  OnSelectedItem() {
    this.RecServ.RecipeSelected.emit(this.recipe);
  }

}
