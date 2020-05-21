import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RecipesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
