import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginViewModel } from '../login-view-model';
import { LoginService } from '../services/login.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginViewModel: LoginViewModel = new LoginViewModel();
  loginError: string = '';
  
  constructor(private loginService: LoginService, private router: Router, private SpinnerService: NgxSpinnerService) {}
  
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");
  }
  
  onLoginClick(event: any) {
    this.SpinnerService.show();
    this.loginService.login(this.loginViewModel).subscribe((response) => {
      this.SpinnerService.hide();
      this.router.navigateByUrl("/main");
    }, (error) => {
      this.SpinnerService.hide();
      console.log(error);
      this.loginError = error.error.message; 
    });
  }

  opensignup() {
    this.router.navigateByUrl("/signup");
  }
}
