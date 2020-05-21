import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.CheckRegistered()) {
      const modreq = req.clone({ params: new HttpParams().set('auth', this.auth.GetUserToken()) });
      return next.handle(modreq);
    } else {
      return next.handle(req);
    }

  }

}
