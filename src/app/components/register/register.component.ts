import { Component, OnInit } from '@angular/core';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;
  public errMsg: string = null;
  public userExists: boolean = false;
  public userData: User;
  
 
  constructor(private formBuilder: FormBuilder, 
    private userService: UserService, 
    private router: Router,
    private sharingService: SharedDataService) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      TZ: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required]
    }, { validator: MustMatch('password', 'confirmPassword')
    });
  }



  public checkIfUser() {
    let val = this.registerForm.value;
    this.userService.checkIfUser(val.email, val.TZ).subscribe(
      (res) => {
        if (res['state'] === "NA") {
          this.userExists = true;
          this.errMsg = res['message'];
        }

        if (res['state'] === "success") {
          this.userData = {
            email: this.registerForm.value.email,
            user_id: +this.registerForm.value.TZ,
            password: this.registerForm.value.password,
            admin: false,
            first_name: "",
            last_name: "",
            city: "",
            street: ""
          }
         
          
          this.sharingService.setUserData(this.userData);
          this.router.navigateByUrl('/register-next');
        }
      }, err => { console.log(err) })
  }





}