import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuard] }
]

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    CommonModule,    
    RouterModule.forChild(routes)
  ]
})
export class ShoppingListModule { }
