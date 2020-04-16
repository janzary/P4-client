import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public serverPath = "http://localhost:3000";



  constructor(private httpClient: HttpClient) { }


  public signIn(email: string, password: string) {
    return this.httpClient.post<User>(`${this.serverPath}/api/users/login`, { email, password })
  }

  public getUserCart(token, id) {
    return this.httpClient.post(`${this.serverPath}/api/carts/user_cart`, {
      'user_id': id
    },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `BEARER ${token}`
        })
      })
  }


  public checkIfUser(email: string, user_id: number) {
    return this.httpClient.post(`${this.serverPath}/api/users/check_if_user`, { email, user_id })
  }

  public register(data) {
    return this.httpClient.post(`${this.serverPath}/api/users/register`, data)

  }

public getUserDetails(token, id: number){
  return this.httpClient.post(`${this.serverPath}/api/user/user`, {
    'user_id': id
  },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `BEARER ${token}`
      })
    })
}


}
