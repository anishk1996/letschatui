import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginViewModel } from '../login-view-model';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginError: string = '';
  loginForm: FormGroup | any;
  
  constructor(private loginService: LoginService, private router: Router, private SpinnerService: NgxSpinnerService, private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");

    this.loginForm = this.formBuilder.group({
      email: ['',  [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  onLoginClick() {
    this.SpinnerService.show();
    this.loginForm['submitted'] = true;
    if (this.loginForm.valid) {
      let loginModel = this.loginForm.value as LoginViewModel;
      this.loginService.login(loginModel).subscribe((response) => {
        this.SpinnerService.hide();
        this.loginForm.reset();
        this.router.navigateByUrl("/main");
      }, (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.loginError = error.error.message;
      });
    } else {
      this.loginError = 'Please check the form again';
      this.SpinnerService.hide();
    }
  }

  opensignup() {
    this.router.navigateByUrl("/signup");
  }
}
