import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../services/userlogin.service';
import { Users } from '../classes/users';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormControlName,
} from '@angular/forms';
import { Router } from '@angular/router';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userDetails: any = Users;
  loginStatus: any;
  loginForm: FormGroup;

  constructor(
    private _userLoginService: UserLoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: SocialAuthService,
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null),
    });
  }

  userLogin() {
    var email = this.loginForm.value.email;
    var password = this.loginForm.value.password;
    this._userLoginService.userLogin(email, password).subscribe((data) => {
      if (data.success == true) {
        localStorage.setItem('userDetails', JSON.stringify(data.data));
        setTimeout(() => {
          this.router.navigate(['']);
        }, 300);
        // console.log((localStorage.getItem('userDetails')));
      } else {
        this.loginStatus = data.message;
      }
    });
  }

  socialLogin() {
    this.authService.authState.subscribe((user) => {
      // const userData = {
      //   "email": user.email,
      //   "password": user.id
      // }
      this._userLoginService.userLogin(user.email, user.id).subscribe((data) => {
        if (data.success == true) {
          localStorage.setItem('userDetails', JSON.stringify(data.data));
          setTimeout(() => {
            this.router.navigate(['']);
          }, 300);
          // console.log((localStorage.getItem('userDetails')));
        } else {
          this.loginStatus = data.message;
        }
      });
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('userDetails')) {
      // location.replace("/order-success");
      this.router.navigate(['']);
    }
    this.authService.authState.subscribe((user) => {
      // const userData = {
      //   "email": user.email,
      //   "password": user.id
      // }
      this._userLoginService.userLogin(user.email, user.id).subscribe((data) => {
        if (data.success == true) {
          localStorage.setItem('userDetails', JSON.stringify(data.data));
          setTimeout(() => {
            this.router.navigate(['']);
          }, 300);
          // console.log((localStorage.getItem('userDetails')));
        } else {
          this.loginStatus = data.message;
        }
      });
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
