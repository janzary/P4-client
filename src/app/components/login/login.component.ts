import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { UserService } from 'src/app/services/user.service';
import { Cart } from 'src/app/models/cart';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public msg: string;
  public errMsg: string = null;
  public previousCartMsg: string;
  public isLoggedIn: boolean = false;
  public loginFailed: boolean = false;
  public isAdmin: boolean = false;
  public user: User;
  public prevCart: Cart= null;
  public prevShopDate: Date;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private sharingService: SharedDataService) {
  }



  ngOnInit(): void {
    this.isLoggedIn = this.sharingService.getLoginData();
    this.msg = `Welcome ${this.sharingService.getUserName()}`;
    this.user = this.sharingService.getUserData();
    this.rerouteAdmin();
    this.userService.signIn(this.user.email, this.user.password).subscribe(
      (res) => {
        if (res['state'] === "success") {
          if (localStorage.getItem('Token')) {
            localStorage.removeItem('Token')
          }
          localStorage.setItem('Token', res['token']);
        }
      }, err => { console.log(err) });

    if (this.isLoggedIn) {
      this.displayCart();
    }


    this.loginForm = this.formBuilder.group({
      'email': [
        "", [Validators.required,
        Validators.email]
      ],
      'password': [
        "", [Validators.required,
        Validators.minLength(6)]
      ]
    })
  }



  public rerouteAdmin(){
    if(this.user.admin){
     return this.router.navigateByUrl('/admin');
    }
  }


  //verify login details and reroute user to shop or admin page
  public verifyUser() {
    let val = this.loginForm.value;
    this.userService.signIn(val.email, val.password).subscribe(
      (res) => {
        if (res['state'] === "success") {
          if (localStorage.getItem('Token')) {
            localStorage.removeItem('Token')
          }
          localStorage.setItem('Token', res['token'])
          this.isLoggedIn = true;
          this.loginFailed = false;
          this.user = res['loggedUser'];
          this.sharingService.setLoginData(this.isLoggedIn);
          this.sharingService.setUserData(this.user);
        }
        if (res['state'] === "success" && !res['loggedUser']['admin']) {
          this.isAdmin = false;
          this.msg = `Welcome ${res['loggedUser']['first_name']}!`;
          this.displayCart();
        }
        if (res['state'] === "success" && res['loggedUser']['admin']) {
          this.isAdmin = true;
          this.router.navigateByUrl('/admin');
        }
        if (res['state'] === "error") {
          this.isAdmin = false;
          this.isLoggedIn = false;
          this.loginFailed = true;
          this.errMsg = res['message'];
        }
      }, err => { console.log(err) })
  }


 public removeErrMsg(){
   if(this.errMsg){
     this.loginFailed = false;
   }
 }


  public signOut() {
    localStorage.removeItem('Token');
    this.isLoggedIn = false;
    this.sharingService.setLoginData(this.isLoggedIn);
    this.router.navigateByUrl('/');

  }



  //get last user cart 
  public displayCart() {
    let token = localStorage.getItem('Token');
    let id = this.user.user_id;
    this.userService.getUserCart(token, id).subscribe((res) => {
      if (res['state'] === "success") {
        this.prevCart = res['message'];
        this.previousCartMsg = `Nice to see you again! We hope you were satisfied with your previous shopping experience on: `;
        this.prevShopDate= this.prevCart.cart_date;
      }
      if (res['state'] === "error") {
        this.previousCartMsg = res['message'];
      }
    });
  }





}



