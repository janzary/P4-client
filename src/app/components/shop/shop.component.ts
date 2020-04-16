import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ProductsService } from 'src/app/services/product.service';
import { Cart, CartItem } from 'src/app/models/cart';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  
  public user: User;
  public products: Product[];
  public selectedProduct: Product[];
  public categories: Category[];
  public isLoggedIn: boolean;
  public needToLogin: string ='';
  public noProductsMsg: string = null;
  public searchInput: string = '';
  public inputVal: boolean = false;
  public searchClicked: boolean = false;
  public addToCartClicked: boolean = false;
  public alert: boolean = false;
  public receivedModalMsg: boolean;
  public receivedItemAddedMsg: Array<CartItem[]> = [];
  public receivedTotalCartPrice: number;
  public cart: Cart;
  public inCartArr: Array<any[]> = [];
  public cartCollapsed: boolean;
 

  public constructor(private productsService: ProductsService, 
                    private sharingService: SharedDataService,
                    private userService: UserService,  
                    private cartService: CartService,
                    private router: Router) { }

  public ngOnInit() {
    this.searchClicked = false;
    this.isLoggedIn = this.sharingService.getLoginData();
    this.user = this.sharingService.getUserData();
    
    this.createCart()
    
    this.productsService.getAllProducts().subscribe( products => {
       this.products = products;
    }, err => {
     console.log("Error: " + err.message);
    });
    
    this.productsService.getCategories().subscribe( categories => {
      this.categories = categories;
    }, err => {
      console.log("Error: " + err.message);
    });
  }


  public isCollapsed(event){
    this.cartCollapsed = event;
  }

  public createCart() {
    if(!this.isLoggedIn){
      return;
    }
    if( this.sharingService.getCart()){  //reload cart if user goes back in browser
    let items = this.sharingService.getCartItems();
    this.receivedItemAddedMsg.push(...items);
    let cartArrItem = this.sharingService.getInCartAlready();
    this.inCartArr.push(...cartArrItem);
    this.cart = this.sharingService.getCart();
    return; 
    }
    this.cartService.createNewCart(this.user.user_id).subscribe(res => {
      if (res['state'] === "success") {
        console.log(res['message']);
        this.getCart();
          }
          if (res['state'] === "error") {
            console.log('error');
          }
    }, err => {
      console.log("Error: " + err.message);
    });
  }
 
  public getCart(){
    let token = localStorage.getItem('Token');
    this.userService.getUserCart(token, this.user.user_id).subscribe(res => {
      if (res['state'] === "success") {
        this.cart = res['message'];
        console.log(this.cart);
        this.sharingService.setCart(this.cart);
      }
      if (res['state'] === "error") {
        console.log('error');
      }
    });

  }

  public displayAllProducts(){
    this.noProductsMsg= null;
    this.productsService.getAllProducts().subscribe( products => {
      this.searchClicked = false;
      this.products = products;
   }, err => {
     console.log("Error: " + err.message);
   });
  }

  
  public displayOneCategory(event){
    this.searchInput = '';
    let id =  event.currentTarget.attributes.id.value;
    let cName = event.currentTarget.innerText
    this.noProductsMsg = null;
   this.productsService.getOneCategory(id).subscribe( (res) => {
       this.searchClicked = false;
       this.products = res;
       if(this.products.length < 1 ){
        this.noProductsMsg = `There are currently no products for the selected category:product_id
         ${cName}`;
      }
    }, err=> console.log(err));
  }


public triggerSearch(){
  if(this.searchInput=== ''){ 
    return this.inputVal = false;
    }
  this.inputVal = true;
  this.searchClicked = true;
}

public unclickSearch(){
  this.inputVal = true;
  this.searchClicked = false;
  this.displayAllProducts();
}

public getIsModal(event: boolean){
  this.receivedModalMsg = event;
  this.addToCartClicked = false;
  }



public getNewItem(event){
   this.receivedItemAddedMsg.push(event);
}

public getCartPrice(event){
   this.receivedTotalCartPrice = event
}

public deletedFromCart(event){
  for(let i = 0; i < event.length; i++){
  let index = this.inCartArr.findIndex(x => x == event[i].product_id);
  this.inCartArr.splice(index, 1);
  }
}

public onSelectItem(event){
  let id = event.currentTarget.attributes.id.value;
  if(this.inCartArr.includes(id)  && this.isLoggedIn && !this.addToCartClicked){
    return alert('Selected item is already in your cart. Please update the item from the cart.');
  }
 this.addToCartClicked = true;
 this.alert = true;
this.inCartArr.push(id);
this.sharingService.setInCartAlready(id);
this.productsService.getOneproduct(id).subscribe((product) => {
    this.selectedProduct = product;
  this.sharingService.setSelectedProduct(this.selectedProduct);
 }, err => {
   console.log("Error: " + err.message);
});

}


  public signOut(){
    localStorage.removeItem('Token');
    this.isLoggedIn = false;
    this.sharingService.setLoginData(this.isLoggedIn);
    this.router.navigateByUrl('/');

  }



public removeAlert(){
  this.alert = false;
}

}
