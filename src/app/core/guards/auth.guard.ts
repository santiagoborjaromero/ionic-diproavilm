import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sessions } from '../helpers/session.helper';
import { GeneralService } from '../services/general.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly sessions = inject(Sessions);
  private readonly svc = inject(GeneralService);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let statusLogged = this.sessions.get('logged')  ;
      if (statusLogged == true) {
        return true;
      }
      this.svc.goRoute("login");
      return false;
  }
}