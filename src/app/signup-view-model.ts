export class SignupViewModel {
    fname: string | any;
    lname: string | any;
    email: string | any;
    dob: string | any;
    gender: string | any;
    password: string | any;
    cpassword: string | any;

    constructor(
        fname: string | any = null,
        lname: string | any = null,
        email: string | any = null,
        dob: string | any = null,
        gender: string | any = null,
        password: string | any = null,
        cpassword: string | any = null) {
        this.fname = fname;
        this.lname = lname;
        this.email = email;
        this.dob = dob;
        this.gender = gender;
        this.password = password;
        this.cpassword = cpassword;
    }
}
