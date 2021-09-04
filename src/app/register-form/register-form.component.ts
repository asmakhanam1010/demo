import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserLoginService } from '../services/userlogin.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { UsersignupService } from '../services/usersignup.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  message: any;
  deliveryOptions: boolean = history.state.lastUrl ? (history.state.lastUrl == 'home' ? true : false) : false;
  user: any;
  loggedIn: any;

  constructor(private authService: SocialAuthService, public __cartService: CartService, private renderer: Renderer2, private formBuilder: FormBuilder, private _userRegisterService: UsersignupService, private router: Router) {
    this.renderer.removeClass(document.body, 'modal-open');

    this.registerForm = new FormGroup({
      "firstName": new FormControl(null),
      "lastName": new FormControl(null),
      "email": new FormControl(null),
      "password": new FormControl(null),
      "address": new FormControl(null),
      "city": new FormControl(null),
      "contact": new FormControl(null),
      "passcode": new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      const userData = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": user.id,
        "address": '',
        "city": '',
        "contact": '',
        "passcode": '',
      }
      this._userRegisterService.userRegister(userData).subscribe(
        data => {
          // console.log(data);
          if (data.success == true) {
            localStorage.setItem('userDetails', JSON.stringify(data.data));
            this.router.navigate(['']);
          } else {
            this.message = data.message;
          }
        }
      )
      // console.log(user);
      // this.user = user;
      // this.loggedIn = (user != null);
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

  registerUser() {
    // this.router.navigate(['payment-method']);
    this._userRegisterService.userRegister(this.registerForm.value).subscribe(
      data => {
        // console.log(data);
        if (data.success == true) {
          localStorage.setItem('userDetails', JSON.stringify(data.data));
          this.router.navigate(['']);
        } else {
          this.message = data.message;
        }
      }
    )
  }

}
