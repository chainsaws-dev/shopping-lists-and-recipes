import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  LoginMode = true;
  IsLoading = false;
  authError: string;
  loggedIn: boolean;
  private authErrSub: Subscription;
  private loginResultSub: Subscription;

  constructor(private authservice: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.authservice.CheckRegistered()) {
      this.Redirect();
    }

    this.authErrSub = this.authservice.AuthErrorSub.subscribe((error: string) => {
      this.authError = error.replace(/_/g, ' ');
      this.IsLoading = false;
    });

    this.loginResultSub = this.authservice.AuthResultSub.subscribe((loggedin: boolean) => {
      this.loggedIn = loggedin;
      this.IsLoading = false;
      if (loggedin) {
        this.Redirect();
      }
    });
  }

  ngOnDestroy(): void {
    this.loginResultSub.unsubscribe();
    this.authErrSub.unsubscribe();
  }

  onSwitchMode() {
    this.LoginMode = !this.LoginMode;
  }

  OnSubmitForm(SignupForm: NgForm) {
    this.IsLoading = true;
    if (this.LoginMode) {
      this.authservice
        .SignIn(SignupForm.value.email, SignupForm.value.password);
    } else {
      this.authservice
        .SignUp(SignupForm.value.email, SignupForm.value.password);
    }

    SignupForm.reset();
  }

  Redirect() {
    this.router.navigate(['/recipes']);
  }

  onHandleCloseError() {
    this.authError = null;
  }
}
