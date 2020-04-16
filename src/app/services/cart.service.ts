import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public serverPath = "http://localhost:3000/api/carts";

  constructor(private httpClient: HttpClient) { }



  public createNewCart(user_id: number): Observable<Cart> {
    return this.httpClient.post<Cart>(`${this.serverPath}/new_cart`, {user_id});
    
  }

  public addItemToCart(product_id: number, quantity: number, cart_id: number ): Observable<CartItem> {
    return this.httpClient.post<CartItem>(`${this.serverPath}/add_item`, { product_id, quantity, cart_id});
    
  }

  public getCartItems(cartId):Observable<any>{
    return this.httpClient.get<any>(`${this.serverPath}/cart_items/${cartId}`)

  }


  public updateQuantity(quantity:number, item_id:number):Observable<any>{
    return this.httpClient.put(`${this.serverPath}/update_item_quantity`,{quantity, item_id} )
  }


  public deleteItem(id: number):Observable<any>{
    return this.httpClient.delete(`${this.serverPath}/delete_item/${id}`)
  }


  public emptyCart(cart_id: number):Observable<any>{
    return this.httpClient.delete(`${this.serverPath}/delete_all/${cart_id}`)
  }

public getAutofillDetails(token, id):Observable<any>{
  return this.httpClient.post(`${this.serverPath}/submit_order/user_info`, {
    'user_id': id
  },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `BEARER ${token}`
      })
    })
}



public submitOrder(token, customer_id, cart_id, cart_price, shipping_city, shipping_street, shipping_date, cc_digits ) :Observable<any>{
  return this.httpClient.post(`${this.serverPath}/submit`, {

    'customer_id': customer_id, 
    'cart_id':cart_id, 
    'cart_price': cart_price,
    'shipping_city': shipping_city, 
    'shipping_street': shipping_street, 
    'shipping_date':shipping_date,  
    'cc_digits': cc_digits 
      
  },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `BEARER ${token}`
      })
    })

}


public downloadReceipt(cartId: number):Observable<any>{
    return this.httpClient.post<any>(`${this.serverPath}/receipt`, {'cart_id': cartId })
}

public getAvailableDates():Observable<any>{
  return this.httpClient.get<any>(`${this.serverPath}/dates`)

}


}