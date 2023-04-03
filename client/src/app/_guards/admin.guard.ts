import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private accountsService: AccountService, private toastr: ToastrService){}

  canActivate(): Observable<boolean>{
    return this.accountsService.currentUser$.pipe(
      map(user =>{
       if(!user) return false;
       if(user.roles.includes('Admin') || user.roles.includes('Moderator')){
        return true;
       } else{
        this.toastr.error('You cannot enter this erea')
        return false;
       }
      })
      )
  }
  
}
