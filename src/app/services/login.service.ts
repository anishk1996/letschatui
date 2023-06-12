import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginViewModel } from '../login-view-model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpClient: HttpClient;
  constructor(private httpBackend: HttpBackend, private jwtHelperService: JwtHelperService, private router: Router) { 
    this.httpClient = new HttpClient(this.httpBackend);
  }
  currentUserName: any = null;

  public login(loginViewModel: LoginViewModel): Observable<any> {
    return this.httpClient.post<any>(environment.endpoint+'/login', loginViewModel, { responseType: 'json' })
    .pipe(map(user => {
      if (user) {
        this.currentUserName = user.name;
        sessionStorage.setItem("name", user.name);
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
      return user;
    }));
  }

   public isAuthenticated(): boolean {
    let token = sessionStorage.getItem("currentUser") ? JSON.parse(sessionStorage.getItem("currentUser") as string).token : null;
    if (this.jwtHelperService.isTokenExpired(token)) {
      return false;
    }
    else {
      return true;
    }
   }
}
