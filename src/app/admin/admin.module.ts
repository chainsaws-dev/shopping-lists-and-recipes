import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';

import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserListComponent } from './users/user-list/user-list.component';

import { MediaListComponent } from './media/media-list/media-list.component';

import { SessionsListComponent } from './sessions/sessions-list/sessions-list.component';

import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
  declarations: [
    AdminComponent,
    UserEditComponent,
    UserListComponent,
    MediaListComponent,
    SessionsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbPaginationModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
