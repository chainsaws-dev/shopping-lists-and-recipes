import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { RecipesRoutingModule } from './recipes/recipes-routing.module';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RecipesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
