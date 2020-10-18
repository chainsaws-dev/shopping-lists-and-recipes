import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';

import { AdminComponent } from './admin.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminResolverService } from './admin-resolver.service';
import { AdminMediaComponent } from './admin-media/admin-media.component';
import { SessionsListComponent } from './sessions-list/sessions-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  {
    path: 'users', component: AdminComponent,  canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: AdminListComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: AdminEditComponent, },
      { path: ':pn/:id', component: AdminEditComponent, resolve: [AdminResolverService] }
    ]
  },
  {
    path: 'sessions', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: SessionsListComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: AdminEditComponent, },
      { path: ':pn/:id', component: AdminEditComponent, resolve: [AdminResolverService] }
    ]
  },
  {
    path: 'media', component: AdminComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '1', pathMatch: 'full'  },
      { path: ':pn', component: AdminMediaComponent, canActivate: [RoleGuard] , data: { expectedRole: 'admin_role_CRUD' } },
      { path: ':pn/new', component: AdminEditComponent, },
      { path: ':pn/:id', component: AdminEditComponent, resolve: [AdminResolverService] }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
