import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthResponseData } from './auth.module';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData: AuthResponseData = null;
  private autoRefreshToken: any;
  public AuthErrorSub = new Subject<string>();
  public AuthResultSub = new Subject<boolean>();
  private authObs: Observable<AuthResponseData>;

  constructor(private http: HttpClient,
              private router: Router) { }

  SignUp(Email: string, Password: string) {
    this.authObs = this.http.post<AuthResponseData>(environment.SignUpUrl + '?key=' + environment.ApiKey,
      {
        Email,
        Password,
        ReturnSecureToken: true
      });

    this.RequestSub();
  }

  SignIn(Email: string, Password: string) {
    this.authObs = this.http.post<AuthResponseData>(environment.SignInUrl + '?key=' + environment.ApiKey,
      {
        Email,
        Password,
        ReturnSecureToken: true
      });

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

      const ExpDur = new Date(this.authData.expirationDate).getTime() -
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
        this.authData.expirationDate = String(new Date(new Date().getTime() + +this.authData.ExpiresIn * 1000));
        localStorage.setItem('userData', JSON.stringify(this.authData));
        this.AuthResultSub.next(response.registered);
        this.AutoSignOut(+this.authData.ExpiresIn * 1000);
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

  CheckTokenExpired() {
    if (this.authData.expirationDate !== '' && this.authData.expirationDate !== null) {
      return !(new Date() > new Date(this.authData.expirationDate));
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
      return this.authData.Email;
    } else {
      return null;
    }
  }
}


