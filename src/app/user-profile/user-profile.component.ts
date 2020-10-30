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

  ShowMessage: boolean;
  MessageType: string;
  ResponseFromBackend: ErrorResponse;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private datastore: DataStorageService) { }

  ngOnDestroy(): void {
    /*
    this.DataLoading.unsubscribe();
    this.RecivedErrorSub.unsubscribe();

    if (this.DatabaseUpdated) {
      this.DatabaseUpdated.unsubscribe();
    }
    */
  }

  ngOnInit(): void {
    this.AuthUrl = environment.GetAuthenticatorUrl;
    this.QrUrl = environment.GetTOTPQRCodeUrl;

    // TEST ONLY REMOVE ON PROD
    this.UserToEdit = new User('Admin', 'chainsaws@rambler.ru', '+79650902819', 'chainsaws');

    // TODO Get Current User here

    if (this.UserToEdit) {

      this.TwoFactorEnabled = this.UserToEdit.SecondFactor;

    }
  }

  OnSaveClick(SubmittedForm: NgForm) {

  }

  OnLinkTwoFactor(SubmittedForm: NgForm) {

  }
}
