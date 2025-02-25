import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sessions } from '../helpers/session.helper';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly sessions = inject(Sessions);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let statusLogged = this.sessions.get('logged')  ;
      if (statusLogged == "false" || statusLogged===undefined || statusLogged===null) {
        return true;
      }
      this.router.navigate(['/dashboard']);
      return false;
  }
}
