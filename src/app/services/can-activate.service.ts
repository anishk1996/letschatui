import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanActivateService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.loginService.isAuthenticated()) {
      return true;
    } else {
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("currentUser")
      this.router.navigate(["login"]);
      return false;
    }
  }
}
