import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private httpClient: HttpClient) { }

  public getProductsTotal(): Observable<object> {
    return this.httpClient.get("http://localhost:3000/api/users/total_products");
    
  }
  public getOrdersTotal(): Observable<object> {
    return this.httpClient.get("http://localhost:3000/api/users//total_orders");
  }
}
