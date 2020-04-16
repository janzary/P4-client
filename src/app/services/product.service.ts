import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public constructor(private httpClient: HttpClient) { }
 
   public getAllProducts(): Observable<Product[]> {
     return this.httpClient.get<Product[]>("http://localhost:3000/api/products");
     
   }
   public getCategories(): Observable<Category[]> {
     return this.httpClient.get<Category[]>("http://localhost:3000/api/products/categories");
   }
 
  public getOneCategory(id): Observable<Product[]>{
    return this.httpClient.get<Product[]>(`http://localhost:3000/api/products/categories/${id}`)
    };
   
 public getOneproduct(id): Observable<Product[]>{
   return this.httpClient.get<Product[]>(`http://localhost:3000/api/products/product/${id}`)
   };
 
 

 public addProduct(token, product_name, category_id, price, image): Observable<Product[]>{
   return this.httpClient.post<Product[]>(`http://localhost:3000/api/products/add_product`,{ 'product_name': product_name, 'category_id': category_id, 'price': price, 'image':image},
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `BEARER ${token}`
      })
    });
 }



 public uploadImage(data): Observable<any>{
  return this.httpClient.post<any>(`http://localhost:3000/api/products/upload`,  data);
}


public updateProduct(token, product_id, product_name, category_id, price, image): Observable<Product[]>{
  return this.httpClient.put<Product[]>(`http://localhost:3000/api/products/update_product`,{ 'product_id': product_id,'product_name': product_name, 'category_id': category_id, 'price': price, 'image':image},
   {
     headers: new HttpHeaders({
       'Content-Type': 'application/json',
       'Authorization': `BEARER ${token}`
     })
   });
  }

 
 }
