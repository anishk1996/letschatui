import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SignupViewModel } from '../signup-view-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private httpClient: HttpClient;
  constructor(private httpBackend: HttpBackend, private jwtHelperService: JwtHelperService, private router: Router) { 
    this.httpClient = new HttpClient(this.httpBackend);
  }
  currentUserName: any = null;

  public signup(signupViewModel: SignupViewModel): Observable<any> {
    return this.httpClient.post<any>(environment.endpoint+'/signup', signupViewModel, { responseType: 'json' })
    .pipe(map(user => {
      if (user) {
        this.currentUserName = user.name;
        sessionStorage.setItem("name", user.name);
        sessionStorage.setItem("currentUser", JSON.stringify(user));
      }
      return user;
    }));
  }
}
