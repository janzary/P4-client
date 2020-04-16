import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  
  private loginData:any = '';
  private userData:any ='';
  private userName:any ='';
  private cartItems = [];
  private selectedProduct: Product[] = [];
  private cart: Cart;
  private alreadyInCart: any[] = []
 

  setLoginData(loginData:any){
    this.loginData = loginData;
  }
  getLoginData():any{
    return this.loginData;
  }

  setUserData(userData:any){
    this.userData = userData;
  }
  getUserData():any{
    return this.userData;
  }


  setUserName(userName:any){
    this.userName = userName;
  }
  getUserName():any{
    return this.userName;
  }

  
  setSelectedProduct(selectedProduct: any){
    this.selectedProduct = selectedProduct;
  }

  getSelectedProduct():any{
   return this.selectedProduct; 
  }


  setCart(cart: any){
    this.cart = cart;
  }

  getCart():any{
   return this.cart; 
  }



  setCartItems(cartItems: any){
    this.cartItems = cartItems;
  }

  getCartItems():any{
   return this.cartItems; 
  }



  setInCartAlready(inCartAlready:any){
    this.alreadyInCart.push(inCartAlready);
  }
  getInCartAlready():any{
    return this.alreadyInCart;
  }

  constructor() { }
}
