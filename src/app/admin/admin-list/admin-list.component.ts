import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from 'src/app/recipes/recipe-model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { User } from '../admin.model';
import { AdminService } from '../admin.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit, OnDestroy {

  private PageChanged: Subscription;
  private FetchOnInint: Subscription;
  private DataLoading: Subscription;

  usCurrentPage: number;
  usPageSize: number;
  usCollectionSize: number;
  IsLoading: boolean;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;
  RecivedErrorSub: Subscription;

  Users: User[];

  constructor(
    private ActiveRoute: ActivatedRoute,
    private DataServ: DataStorageService,
    public AdminServ: AdminService,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.PageChanged.unsubscribe();
    this.DataLoading.unsubscribe();
    this.FetchOnInint.unsubscribe();
  }

  ngOnInit(): void {
    this.usPageSize = environment.AdminUserListPageSize;

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => this.ShowMessage = false, 5000);

        switch (response.Error.Code) {
          case 200:
            this.MessageType = 'success';
            break;
          default:
            this.MessageType = 'danger';
            break;
        }
      }
    );

    this.PageChanged = this.ActiveRoute.params.subscribe((params: Params) => {
      this.usCurrentPage = +params.pn;
    });

    this.DataLoading = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );


    this.FetchOnInint = this.DataServ.FetchUsersList(this.usCurrentPage, environment.AdminUserListPageSize).subscribe(
      (value) => {
        this.Users = this.AdminServ.GetUsers();
        this.usCollectionSize = this.AdminServ.Total;
      },
      (error) => {
        this.Users = [];
      }
    );

  }

  OnPageChanged(page: number) {

    this.usCurrentPage = page;
    this.FetchOnInint = this.DataServ.FetchUsersList(page, environment.AdminUserListPageSize).subscribe(
      () => {
        this.Users = this.AdminServ.GetUsers();
        this.router.navigate(['../', page.toString()], { relativeTo: this.ActiveRoute });
      }
    );

  }

  OnDeleteUser(usertodelete: User, index: number): void {

    this.AdminServ.DeleteUser(index);

    this.DataServ.DeleteUser(usertodelete);

  }

}
