import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { NgbAlertModule, NgbTooltipModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        }),
        NgbTooltipModule,
        NgbDropdownModule,
        NgbPaginationModule,
        NgbAlertModule,
        AppRoutingModule,
        FormsModule,
        SharedModule,
        BrowserAnimationsModule], providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}