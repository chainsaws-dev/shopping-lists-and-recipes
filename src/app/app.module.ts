import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { NgbAlertModule, NgbTooltipModule, NgbPaginationModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        	TranslateModule.forRoot({
			fallbackLang: environment.DefaultLocale,
			loader: provideTranslateHttpLoader({prefix:"./assets/i18n/", suffix:".json"}),
		}),
        NgbTooltipModule,
        NgbDropdownModule,
        NgbPaginationModule,
        NgbAlertModule,
        AppRoutingModule,
        FormsModule,
        SharedModule,
        ], providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }

export function httpTranslateLoader() {
  return new TranslateHttpLoader()
}
