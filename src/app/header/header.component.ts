import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  @Output() FeatureSelected = new EventEmitter<string>();
  RecipesClass = 'nav-link active';
  ShoppingClass = 'nav-link';

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(feature: string) {
    this.FeatureSelected.emit(feature);
    if (feature === 'recipe') {
      this.RecipesClass = 'nav-link active';
      this.ShoppingClass = 'nav-link';
    } else {
      this.RecipesClass = 'nav-link';
      this.ShoppingClass = 'nav-link active';
    }
  }

}
