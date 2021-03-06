import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedDataService } from '../services/shared-data.service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  public user: User;
  

constructor(private router: Router, private sharingService: SharedDataService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { 
    this.user = this.sharingService.getUserData();
      const isAuth =  !!this.user.admin;
      if(isAuth){
        return true;
      }
      return this.router.createUrlTree(['/404']); 
  } 
}
