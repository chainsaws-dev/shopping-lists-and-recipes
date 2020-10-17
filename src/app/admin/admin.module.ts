import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/role.guard';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminResolverService } from './admin-resolver.service';
import { AdminMediaComponent } from './admin-media/admin-media.component';
import { AdminSessionsComponent } from './admin-sessions/admin-sessions.component';

const routes: Routes = [
  { path: '', redirectTo: '1', pathMatch: 'full' },
  { path: ':pn', component: AdminComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
  { path: ':pn/new', component: AdminEditComponent, },
  { path: ':pn/:id', component: AdminEditComponent, resolve: [AdminResolverService] }
];

@NgModule({
  declarations: [
    AdminComponent,
    AdminEditComponent,
    AdminListComponent,
    AdminMediaComponent,
    AdminSessionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbAlertModule,
    NgbPaginationModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
