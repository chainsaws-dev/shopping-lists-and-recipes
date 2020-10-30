import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from '../shared/shared.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router, Params, UrlSegment } from '@angular/router';
import * as url from 'url';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

  IsLoading = false;

  ResponseFromBackend: ErrorResponse;

  ShowMessage: boolean;
  MessageType: string;

  RecivedErrorSub: Subscription;
  RecivedResponseSub: Subscription;
  DataServiceSub: Subscription;

  Token: string;

  ResetPasswordMode: boolean;

  constructor(
    private DataServ: DataStorageService,
    private activeroute: ActivatedRoute,
    private router: Router) { }

  ngOnDestroy(): void {
    this.RecivedErrorSub.unsubscribe();
    this.RecivedResponseSub.unsubscribe();
    this.DataServiceSub.unsubscribe();
  }

  ngOnInit(): void {

    this.DataServiceSub = this.DataServ.LoadingData.subscribe(
      (State) => {
        this.IsLoading = State;
      }
    );

    this.RecivedErrorSub = this.DataServ.RecivedError.subscribe(
      (response) => {

        this.ShowMessage = true;
        this.ResponseFromBackend = response;
        setTimeout(() => this.ShowMessage = false, 5000);

        if (response) {
          switch (response.Error.Code) {
            case 200:
              this.MessageType = 'success';
              break;
            default:
              this.MessageType = 'danger';
              break;
          }
        }
      }
    );

    this.activeroute.queryParams.subscribe((Qparams: Params) => {

      this.Token = Qparams.Token;

      const cururl = this.getUrlWithoutParams();

      this.ResetPasswordMode = cururl === '/reset-password';

      if (!this.ResetPasswordMode) {
        if (this.Token) {
          this.DataServ.ConfirmEmail(this.Token);
        }
      }
    }
    );
  }

  getUrlWithoutParams() {
    const urlTree = this.router.parseUrl(this.router.url);
    urlTree.queryParams = {};
    return urlTree.toString();
  }

  OnSubmitForm(ResendConfEmailForm: NgForm) {
    if (ResendConfEmailForm.valid) {

      this.IsLoading = true;

      if (this.ResetPasswordMode && this.Token) {
        this.DataServ.SubmitNewPassword(this.Token, ResendConfEmailForm.value.newpassword);
      } else {
        if (this.ResetPasswordMode) {
          this.DataServ.SendEmailResetPassword(ResendConfEmailForm.value.email);
        } else {
          this.DataServ.SendEmailConfirmEmail(ResendConfEmailForm.value.email);
        }
      }

      ResendConfEmailForm.reset();

    }

  }
}
