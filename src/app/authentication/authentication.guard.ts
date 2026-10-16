import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  currentUser:any;
  constructor(private authenticationService: AuthenticationService, private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}