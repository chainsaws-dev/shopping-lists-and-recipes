import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.CheckRegistered()) {

      const headers = new HttpHeaders({
        Auth: this.auth.GetUserToken(),
        ApiKey: environment.ApiKey
      });

      const modreq = req.clone({headers});

      return next.handle(modreq);
    } else {

      const headers = new HttpHeaders({
        ApiKey: environment.ApiKey
      });

      const modreq = req.clone({headers});

      return next.handle(modreq);
    }

  }

}
