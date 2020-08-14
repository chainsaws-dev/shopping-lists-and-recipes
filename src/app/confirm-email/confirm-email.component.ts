import { Component, OnInit, OnDestroy } from '@angular/core';
import { ErrorResponse } from '../admin/admin.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

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

    this.activeroute.queryParams.subscribe((Qparams: Params) => {

      this.Token = Qparams.Token;

      if (this.Token) {
        this.DataServ.ConfirmEmail(this.Token);
      }

    }
    );
  }

  OnSubmitForm(ResendConfEmailForm: NgForm) {
    if (ResendConfEmailForm.valid) {

      this.IsLoading = true;

      this.DataServ.ResendEmail(ResendConfEmailForm.value.email);

      ResendConfEmailForm.reset();

    }

  }
}
