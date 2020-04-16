import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-register2',
  templateUrl: './register2.component.html',
  styleUrls: ['./register2.component.css']
})
export class Register2Component implements OnInit {

  public newUser: User;
  public registerForm2: FormGroup;
  userData: User;
  loginData: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private sharingService: SharedDataService) { }

  ngOnInit(): void {
    this.userData = this.sharingService.getUserData();

    this.registerForm2 = this.formBuilder.group({
      city: ["", [Validators.required, Validators.minLength(2)]],
      street: ["", [Validators.required, Validators.minLength(4)]],
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]]
    });
  }




  public registerUser() {
    this.userData = {
      email: this.userData.email,
      user_id: +this.userData.user_id,
      password: this.userData.password,
      admin: this.userData.admin,
      first_name: this.registerForm2.value.firstName,
      last_name: this.registerForm2.value.lastName,
      city: this.registerForm2.value.city,
      street: this.registerForm2.value.street
    }
    this.userService.register(this.userData).subscribe((res) => {
      if (res['state'] === 'success') {
        this.loginData = true;
        this.sharingService.setUserName(this.userData.first_name);
        this.sharingService.setLoginData(this.loginData);
        this.sharingService.setUserData(this.userData);
        this.router.navigateByUrl('/login');
      }
      if (res['state'] === 'error') {
        console.log(res['message']);
      }

    }, err => { console.log(err) });
  }





}
