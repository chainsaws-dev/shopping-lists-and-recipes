import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AlertComponent } from './shared/alert/alert.component';
import { RecipesModule } from './recipes/recipes.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,    
    NgbTooltipModule,
    NgbDropdownModule,
    AppRoutingModule,
    HttpClientModule,
    RecipesModule,
    ShoppingListModule    
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
