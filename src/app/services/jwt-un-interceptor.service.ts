import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtUnInterceptorService implements HttpInterceptor{

  constructor(private router: Router, private SpinnerService: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // dosomething
        }
      },
      (error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status == 401) {
            alert('You are not authorized to access this')
            sessionStorage.removeItem('currentUser')
            sessionStorage.removeItem('name')
            this.SpinnerService.hide();
            this.router.navigateByUrl("/login");
          }
          if (error.status == 403) {
            alert('Your token has expired, please re login')
            sessionStorage.removeItem('currentUser')
            sessionStorage.removeItem('name')
            this.SpinnerService.hide();
            this.router.navigateByUrl("/login"); 
          }
        }
      }
    ));
  }
}
