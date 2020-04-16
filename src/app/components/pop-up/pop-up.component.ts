import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { User } from 'src/app/models/user';
import { Cart, CartItem } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
  @Input() selectedProduct: Product[];
  @Output() modalClosed = new EventEmitter<boolean>();
  @Output() itemAdded = new EventEmitter<CartItem[]>();
  @Output() cartPrice= new EventEmitter<number>();
  public quantity: number = 1;
  public cartItem: CartItem;
  public item: any;
  public cartItemsList: Array<CartItem[]> = [];
  public cart: Cart;
  public user: User;
  public addClicked: boolean = false;
  
  constructor(private sharingData: SharedDataService,
    private cartService: CartService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.getUser();
   this.cart = this.sharingData.getCart();
    this.cartItemsList = this.sharingData.getCartItems();
  }


  public getUser() {
    this.user = this.sharingData.getUserData()
  }


  public addToCart() {
    console.log(this.cart);
    this.cartItem = this.sharingData.getSelectedProduct();
    console.log(this.cartItem)
    this.cartService.addItemToCart(this.cartItem[0]['product_id'],
      this.quantity,
      this.cart.id).subscribe(res => {
        if (res['state'] === "success") {
          console.log(res['message']);
          this.setCartItems();         
        }
      }, err => {
        console.log("Error: " + err.message);
      });
  }


  public setCartItems() {
      this.cartService.getCartItems(this.cart.id).subscribe(res => {
        if (res['state'] === "success") {
          console.log(res['message']);
          this.cartItemsList = res['message'];
          this.sharingData.setCartItems(this.cartItemsList);
          this.item = this.cartItemsList.find(item => item['product_id'] == this.cartItem[0]['product_id']) 
          this.itemAdded.emit(this.item);
          this.cartPrice.emit(this.cartItemsList.map(item => item['total_price']).reduce((a,b)=> {return a + b}));
          this.addClicked = true;
          this.modalClosed.emit(true);
        }
      }, err => {
        console.log("Error: " + err.message);
      }) 
  }




}
