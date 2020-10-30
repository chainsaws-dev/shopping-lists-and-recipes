import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../admin/users/users.model';
import { DataStorageService } from '../shared/data-storage.service';
import { ErrorResponse } from '../shared/shared.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  index: number;

  UserToEdit: User;

  TwoFactorEnabled: boolean;

  IsLoading: boolean;
  changepassword: boolean;

  AuthUrl: string;
  QrUrl: string;


  private DatabaseUpdated: Subscription;
  private DataLoading: Subscription;
  private RecivedErrorSub: Subscription;

  private FetchUser: Subscription;

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private datastore: DataStorageService) { }

  ngOnDestroy(): void {


  }

  ngOnInit(): void {

    this.AuthUrl = environment.GetAuthenticatorUrl;
    this.QrUrl = environment.GetTOTPQRCodeUrl;

    this.FetchUser = this.datastore.CurrentUserFetch.subscribe(
      (ThisUser) => {
        this.UserToEdit = ThisUser;

        if (this.UserToEdit) {
          this.TwoFactorEnabled = this.UserToEdit.SecondFactor;
        }
      }
    );

    this.RecivedErrorSub = this.datastore.RecivedError.subscribe(
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

    this.DataLoading = this.datastore.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.datastore.FetchCurrentUser();
  }

  OnSaveClick(SubmittedForm: NgForm) {

  }

  OnLinkTwoFactor(SubmittedForm: NgForm) {

  }
}
