import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupViewModel } from '../signup-view-model';
import { SignupService } from '../services/signup.service';
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../services/custom-validators.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupError: string = '';
  signupForm: FormGroup | any;
  constructor(private router: Router, public signupService: SignupService, private SpinnerService: NgxSpinnerService, private formBuilder: FormBuilder, private customValidator: CustomValidatorsService) {}
  
  ngOnInit(): void {
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("currentUser");

    this.signupForm = this.formBuilder.group({
       fname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
       lname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
       email: ['', [Validators.required, Validators.email]],
       dob: ['', [Validators.required, this.customValidator.minimumAgeValidator(12)]],
       gender: ['', [Validators.required]],
       password: ['', [Validators.required]],
       cpassword: ['', [Validators.required]]
    },
    {
      validators: [
        this.customValidator.compateValidator("cpassword", "password")
      ]
    });
  }

  onSignUpClick() {
    this.SpinnerService.show();
    this.signupForm['submitted'] = true;
    if (this.signupForm.valid) {
      let signupModel = this.signupForm.value as SignupViewModel;
      this.signupService.signup(signupModel).subscribe((response) => {
        this.SpinnerService.hide();
        this.signupForm.reset();
        this.router.navigateByUrl("/main");
      }, (error) => {
        this.SpinnerService.hide();
        console.log(error);
        this.signupError = error.error.message; 
      });
    } else {
      this.signupError = 'Please check the form again';
      this.SpinnerService.hide();
    }
  }

  openlogin() {
    this.router.navigateByUrl("/login");
  }
}
