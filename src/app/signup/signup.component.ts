import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupViewModel } from '../signup-view-model';
import { SignupService } from '../services/signup.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{

  signupViewModel: SignupViewModel = new SignupViewModel();
  signupError: string = '';

  constructor(private router: Router, public signupService: SignupService) {}
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");
  }

  onSignInClick() {
    this.signupService.signup(this.signupViewModel).subscribe((response) => {
      this.router.navigateByUrl("/main");
    }, (error) => {
      console.log(error);
      this.signupError = "Registration not successful"; 
    });
  }

  openlogin() {
    this.router.navigateByUrl("/login");
  }
}
