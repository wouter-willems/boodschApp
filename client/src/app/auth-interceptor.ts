import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {stringIsSetAndFilled} from "../util/values";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request.url.includes('/auth/')) {
      return next.handle(request);
    }
    const active_environment = localStorage.getItem('active_environment');
    const environment = active_environment.split('-')[0];
    const authToken = active_environment.split('-')[1];
    if (!stringIsSetAndFilled(authToken)) {
      return next.handle(request);
    }
    const authReq = request.clone({
      headers: request.headers.set('token', authToken).set('environment', environment)
    });
    return next.handle(authReq);
  }
}
