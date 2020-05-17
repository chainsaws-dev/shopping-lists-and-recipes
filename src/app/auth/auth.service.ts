import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RefreshTokenResponseData, SignInResponseData, SignUpResponseData } from './auth.module';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apikey = 'AIzaSyB3Jr8tp5wotjeS-re9iBSgX2b1zbM0Fx4';
  private baseURL = 'https://identitytoolkit.googleapis.com/v1/accounts';

  private authData: SignInResponseData = null;
  public AuthErrorSub = new Subject<string>();
  public AuthResultSub = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  SignIn(email: string, password: string) {
    return this.http.post<SignInResponseData>(this.baseURL + ':signInWithPassword?key=' + this.apikey,
      {
        email,
        password,
        returnSecureToken: true
      }).subscribe(
        response => {
          this.authData = response;
          this.AuthResultSub.next(response.registered);
          this.AutoRefreshToken(+this.authData.expiresIn * 1000);
        }, error => {
          this.AuthErrorSub.next(error.error.error.message);
        }
      );
  }


  SignUp(email: string, password: string) {
    return this.http.post<SignUpResponseData>(this.baseURL + ':signUp?key=' + this.apikey,
      {
        email,
        password,
        returnSecureToken: true
      }).subscribe(
        response => {
          this.authData = { ...response, registered: true };
          this.AuthResultSub.next(true);
          this.AutoRefreshToken(+this.authData.expiresIn * 1000);
        }, error => {
          this.AuthErrorSub.next(error.error.error.message);
        }
      );
  }

  private AutoRefreshToken(timeout: number) {
    setTimeout(() => {
      this.RefreshToken();
    }, timeout);
  }

  private RefreshToken() {
    return this.http.post<RefreshTokenResponseData>('https://securetoken.googleapis.com/v1/token?key=' + this.apikey,
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


