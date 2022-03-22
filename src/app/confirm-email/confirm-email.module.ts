import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ConfirmEmailComponent} from './confirm-email.component';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  { path: '', component: ConfirmEmailComponent, },
];

@NgModule({
  declarations: [
    ConfirmEmailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgbTooltipModule
  ]
})
export class ConfirmEmailModule { }


export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http)
}