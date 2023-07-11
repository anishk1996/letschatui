import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  public minimumAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
       if(!control.value) return null; //return, if the date of birth is null

       let today = new Date();
       let dob = new Date(control.value);
       let diffMilliSeconds = Math.abs(today.getTime() - dob.getTime());
       let diffYears = (diffMilliSeconds / (1000*60*60*24)) / 365.25;
       if (diffYears >= minAge) {
        return null; // valid
       } else {
        return { minAge: { valid: false } }; // invalid
       }
    };
  }

  public compateValidator(controlToValidate: string, controlToCompate: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      if(!(formGroup.get(controlToValidate) as FormControl).value) return null; //return if the confirm password is null

      if((formGroup.get(controlToValidate) as FormControl).value == (formGroup.get(controlToCompate) as FormControl).value) {
        return null;
      } else {
        (formGroup.get(controlToValidate) as FormControl).setErrors({ compateValidator: { valid: false } });
        return { compateValidator: { valid: false } }; //invalid
      }
    };
  }
}
