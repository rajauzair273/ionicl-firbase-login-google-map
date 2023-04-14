import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authServ: ApiService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): any {
        return this.authServ.checkAuth().then((user: any) => {
            if (user) {
                localStorage.setItem('uid', user.uid);
               
                return true;
            } else {
                this.router.navigate(['login']);
            }
        }).catch(error => {
            console.log(error);
            this.router.navigate(['login']);
        });
    }
  
}