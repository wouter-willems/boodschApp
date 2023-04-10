import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {stringIsSetAndFilled} from "../util/values";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('token');
    if (!stringIsSetAndFilled(authToken)) {
      return next.handle(request);
    }
    const authReq = request.clone({
      headers: request.headers.set('token', authToken)
    });
    return next.handle(authReq);
  }
}
