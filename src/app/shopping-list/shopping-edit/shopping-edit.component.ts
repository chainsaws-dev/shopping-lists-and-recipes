import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Ingredient } from '../../shared/ingredients.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @Input() SelectedItem: Ingredient;
  @Input() ItemsCount: number;
  @Output() OnAddNewItem = new EventEmitter<Ingredient>();
  @Output() OnDeleteSelectedItem = new EventEmitter<Ingredient>();
  @Output() OnClearItems = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  AddNewItem(NameInput: HTMLInputElement, AmountInput: HTMLInputElement): void {
    this.OnAddNewItem.emit(new Ingredient(NameInput.value, parseInt(AmountInput.value, 10)));
  }

  DeleteSelectedItem() {
    this.OnDeleteSelectedItem.emit(this.SelectedItem);
    this.SelectedItem = null;
  }

  ClearAllItems() {
    this.OnClearItems.emit();
  }
}
