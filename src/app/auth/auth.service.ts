import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthResponseData, AuthRequest } from './auth.module';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ErrorResponse } from '../recipes/recipe-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData: AuthResponseData = null;
  private autoRefreshToken: any;
  public AuthErrorSub = new Subject<ErrorResponse>();
  public AuthResultSub = new Subject<boolean>();
  private authObs: Observable<AuthResponseData>;

  constructor(private http: HttpClient,
              private router: Router) { }

  SignUp(Email: string, Password: string) {

    const signup: AuthRequest = {
      Email: btoa(Email),
      Password: btoa(encodeURI(Password)),
      ReturnSecureToken: true,
    };

    this.authObs = this.http.post<AuthResponseData>(
      environment.SignUpUrl + '?key=' + environment.ApiKey,
      signup);

    this.RequestSub();
  }

  SignIn(Email: string, Password: string) {

    const signin: AuthRequest = {
      Email: btoa(Email),
      Password: btoa(encodeURI(Password)),
      ReturnSecureToken: true,
    };

    this.authObs = this.http.post<AuthResponseData>(
      environment.SignInUrl + '?key=' + environment.ApiKey,
      signin);

    this.RequestSub();
  }

  SignOut() {
    this.authData = null;
    if (this.autoRefreshToken) {
      clearTimeout(this.autoRefreshToken);
    }

    localStorage.removeItem('userData');

    this.AuthResultSub.next(false);
    this.router.navigate(['/auth']);
  }

  AutoSignIn() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      return;
    } else {
      this.authData = JSON.parse(userData);

      const ExpDur = new Date(this.authData.ExpirationDate).getTime() -
        new Date().getTime();

      this.AuthResultSub.next(true);
      this.AutoSignOut(ExpDur);
    }
  }

  private AutoSignOut(ExpiresIn: number) {
    this.autoRefreshToken = setTimeout(() => {
      this.SignOut();
    }, ExpiresIn);
  }

  private RequestSub() {
    this.authObs.subscribe(
      response => {
        this.authData = response;
        this.authData.ExpirationDate = String(new Date(new Date().getTime() + +this.authData.ExpiresIn * 1000));
        localStorage.setItem('userData', JSON.stringify(this.authData));
        this.AuthResultSub.next(response.Registered);
        this.AutoSignOut(+this.authData.ExpiresIn * 1000);
      }, error => {
        const errresp = error.error as ErrorResponse;
        this.AuthErrorSub.next(errresp);
      }
    );
  }

  CheckRegistered() {
    if (this.authData !== null) {
      return this.authData.Registered;
    } else {
      return false;
    }
  }

  CheckTokenExpired() {
    if (this.authData.ExpirationDate !== '' && this.authData.ExpirationDate !== null) {
      return !(new Date() > new Date(this.authData.ExpirationDate));
    }
    else {
      return false;
    }
  }

  GetUserToken() {
    if (this.CheckTokenExpired()) {
      return this.authData.Token;
    } else {
      return null;
    }
  }

  GetUserEmail() {
    if (this.authData) {
      return atob(this.authData.Email);
    } else {
      return null;
    }
  }

  GetUserRole() {
    if (this.authData) {
      return atob(this.authData.Role);
    } else {
      return null;
    }
  }
}


