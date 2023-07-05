import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupViewModel } from '../signup-view-model';
import { SignupService } from '../services/signup.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  signupViewModel: SignupViewModel = new SignupViewModel();
  signupError: string = '';

  constructor(private router: Router, public signupService: SignupService, private SpinnerService: NgxSpinnerService) {}
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");
  }

  onSignInClick() {
    this.SpinnerService.show();
    this.signupService.signup(this.signupViewModel).subscribe((response) => {
      this.SpinnerService.hide();
      this.router.navigateByUrl("/main");
    }, (error) => {
      this.SpinnerService.hide();
      console.log(error);
      this.signupError = error.error.message; 
    });
  }

  openlogin() {
    this.router.navigateByUrl("/login");
  }
}
