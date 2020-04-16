import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { CartService } from 'src/app/services/cart.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ProductsService } from 'src/app/services/product.service';
import { User } from 'src/app/models/user';
import { Cart, CartItem } from 'src/app/models/cart';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  public minDate = new Date();
  public maxDate: any; 
  public  now = new Date();
  public  year = this.now.getFullYear();
  public  month = this.now.getMonth()+1;
  public  day = this.now.getDay()+5;
  public isLoggedIn: boolean = true;
  public cartTotal: number = 0;
  public cartItemsList: CartItem[] = [];
  public cart: Cart;
  public checkoutForm: FormGroup;
  public ccIsValid: boolean = true;
  public ccInvalidMsg: string;
  public user: User;
  public successMsg: boolean = false;
  public cartId: number;
  public unavailableDates: any[]=[];
  public unavailable: boolean = false;
  

  public constructor(private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private sharingService: SharedDataService,
    private cartService: CartService,
    private router: Router) { }


  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]
      ],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      street: ["", [Validators.required, Validators.minLength(4)]],
      city: ["", [Validators.required, Validators.minLength(2)]],
      shipDate: ["", [Validators.required]],
      ccNum: ["", [Validators.required, Validators.minLength(13),
      Validators.maxLength(16)]]
    })

    this.getCartList();
    this.autofill();
    this.user = this.sharingService.getUserData();
    this. maxDate = moment({year: this.year, month: this.month, day: this.day}).format('YYYY-MM-DD');
   // console.log(this.maxDate);
    this.filterDeliveryDates();
  }




  public signOut() {
    localStorage.removeItem('Token');
    this.isLoggedIn = false;
    this.sharingService.setLoginData(this.isLoggedIn);
    this.router.navigateByUrl('/');
  }



  public getCartList() {
    this.cart = this.sharingService.getCart();
    if (this.cart) {
      this.cartItemsList = this.sharingService.getCartItems()
      this.cartTotal = this.cartItemsList.map(item => item['total_price']).reduce((a, b) => { return a + b });
    }
  }



  public autofill() {
    if (this.cartItemsList.length < 1) {
      return;
    }
    let token = localStorage.getItem('Token');
    let user = this.sharingService.getUserData();
    this.cartService.getAutofillDetails(token, user.user_id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message'])
        this.checkoutForm.get('firstName').setValue(res['message']['first_name'])
        this.checkoutForm.get('lastName').setValue(res['message']['last_name'])
        this.checkoutForm.get('street').setValue(res['message']['street'])
        this.checkoutForm.get('city').setValue(res['message']['city'])
      }
      if (res['state'] === 'error') {
        console.log(res['message'])

      }
    })
  }



  public validateCCNum() {
    let num = this.checkoutForm.get('ccNum').value;
    var visaRegEx = new RegExp('^(?:4[0-9]{12}(?:[0-9]{3})?)$');
    var mastercardRegEx = new RegExp('^(?:5[1-5][0-9]{14})$');
    var amexpRegEx = new RegExp('^(?:3[47][0-9]{13})$');
    var discovRegEx = new RegExp('^(?:6(?:011|5[0-9]{2})[0-9]{12})$');

    if (visaRegEx.test(num) ||
      mastercardRegEx.test(num) ||
      amexpRegEx.test(num) ||
      discovRegEx.test(num)) {
      this.ccIsValid = true;
      console.log('cc valid');

      this.submitOrder();

    } else {
      this.ccIsValid = false;
      this.ccInvalidMsg = "Please provide a valid credit card number!";
    }
  }


  public submitOrder() {
    if (this.cartItemsList.length < 1) {
      return;
    }
    let token = localStorage.getItem('Token');
    this.cartService.submitOrder(token,
      this.user['user_id'],
      this.cart.id,
      this.cartTotal,
      this.checkoutForm.get('city').value,
      this.checkoutForm.get('street').value,
      this.checkoutForm.get('shipDate').value,
      this.checkoutForm.get('ccNum').value).subscribe(res => {
        if (res['state'] === "success") {
          console.log(res['message'])
          this.successMsg = true;
          this.cartId = this.cart.id;
          this.cart = null; 
          this.cartTotal = 0;
          this.cartItemsList.splice(0, this.cartItemsList.length);
          this.sharingService.setCartItems(this.cartItemsList);
          this.sharingService.setCart(this.cart);
          this.checkoutForm.get('firstName').setValue('')
          this.checkoutForm.get('lastName').setValue('')
          this.checkoutForm.get('street').setValue('')
          this.checkoutForm.get('city').setValue('')
          //this.checkoutForm.get('shipDate').setValue('')
          this.checkoutForm.get('ccNum').setValue('')

        }
        if (res['state'] === 'error') {
          console.log(res['message'])

        }
      })

  }


  public downloadReceipt() {
    this.cartService.downloadReceipt(this.cartId).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message'])
        console.log(res['receipt'])
        const blob = new Blob([res['message']], { type: 'text' })
        const fileName = res['fileName'];
        saveAs(blob, fileName);
      }
      if (res['state'] === 'error') {
        console.log(res['message'])
      }
    });
  }
 
  public dateFilter = (d: Date) => { 
    this.unavailable = false;
    let dateInput = new Date(`${this.checkoutForm.get('shipDate').value}`)
    let parsedDateInput = dateInput.toString().split(' 00:00:00')[0];
      if(parsedDateInput !== 'Invalid Date'){
      if(this.unavailableDates.includes(parsedDateInput)){
       this.unavailable = true; //will dispaly date invalid message 
      }
    }
    
    const day = d.getDay();
    return day !== 0 && day !== 6 //sunday & saturday not selectable on calendar
}

  
public filterDeliveryDates(){
  this.cartService.getAvailableDates().subscribe(res => {
    if (res['state'] === "success") {
     // console.log(res['message'])
      for(let i =0; i < res['message'].length; i++){
       let date = new Date(`${res['message'][i]['shipping_date']}`);
       let stringDate = date.toString().split(' 00:00:00')[0];
       this.unavailableDates.push(stringDate)
      }
     console.log('unavailable dates: '+ this.unavailableDates); 
    }
    if (res['state'] === 'error') {
      console.log(res['message'])
    } 
  });
}





}