import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RefreshTokenResponseData, AuthResponseData } from './auth.module';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apikey = 'AIzaSyB3Jr8tp5wotjeS-re9iBSgX2b1zbM0Fx4';
  private baseURL = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private refreshURL = 'https://securetoken.googleapis.com/v1/';

  private authData: AuthResponseData = null;
  private autoRefreshToken: any;
  public AuthErrorSub = new Subject<string>();
  public AuthResultSub = new Subject<boolean>();
  private authObs: Observable<AuthResponseData>;

  constructor(private http: HttpClient) { }

  SignUp(email: string, password: string) {
    this.authObs = this.http.post<AuthResponseData>(this.baseURL + ':signUp?key=' + this.apikey,
      {
        email,
        password,
        returnSecureToken: true
      });

    this.RequestSub();
  }

  SignIn(email: string, password: string) {
    this.authObs = this.http.post<AuthResponseData>(this.baseURL + ':signInWithPassword?key=' + this.apikey,
      {
        email,
        password,
        returnSecureToken: true
      });

    this.RequestSub();
  }

  SignOut() {
    this.authData = null;
    clearTimeout(this.autoRefreshToken);
  }

  private RequestSub() {
    this.authObs.subscribe(
      response => {
        this.authData = response;
        this.AuthResultSub.next(response.registered);
        this.AutoRefreshToken(+this.authData.expiresIn * 1000);
      }, error => {
        this.AuthErrorSub.next(error.error.error.message);
      }
    );
  }

  private AutoRefreshToken(timeout: number) {
    this.autoRefreshToken = setTimeout(() => {
      this.RefreshToken();
    }, timeout);
  }

  private RefreshToken() {
    if (this.authData) {
      return this.http.post<RefreshTokenResponseData>(this.refreshURL + 'token?key=' + this.apikey,
        {
          grant_type: 'refresh_token',
          refresh_token: this.authData.refreshToken
        }).subscribe(
          response => {
            this.authData = {
              ...response, registered: true, idToken: response.id_token,
              email: this.authData.email,
              expiresIn: response.expires_in,
              refreshToken: response.refresh_token,
              localId: this.authData.localId
            };
            this.AuthResultSub.next(true);
            this.AutoRefreshToken(+this.authData.expiresIn * 1000);
          }, error => {
            this.AuthErrorSub.next(error.error.error.message);
          }
        );
    }
  }

  CheckRegistered() {
    if (this.authData !== null) {
      return this.authData.registered;
    } else {
      return false;
    }
  }

  GetUserToken() {
    return this.authData.idToken;
  }

  GetUserEmail() {
    return this.authData.email;
  }
}


