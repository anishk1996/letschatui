import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginViewModel } from '../login-view-model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginViewModel: LoginViewModel = new LoginViewModel();
  loginError: string = '';
  
  constructor(private loginService: LoginService, private router: Router) {}
  
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");
  }
  
  onLoginClick(event: any) {
    this.loginService.login(this.loginViewModel).subscribe((response) => {
      this.router.navigateByUrl("/main");
    }, (error) => {
      console.log(error);
      this.loginError = "Invalid Username or password"; 
    });
  }

  opensignup() {
    this.router.navigateByUrl("/signup");
  }
}
