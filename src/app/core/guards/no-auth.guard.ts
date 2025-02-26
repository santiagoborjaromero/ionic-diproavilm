import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sessions } from '../helpers/session.helper';
import { GeneralService } from '../services/general.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  private readonly router = inject(Router);
  private readonly sessions = inject(Sessions);
  private readonly svc = inject(GeneralService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("NoAuthGuard")
      let statusLogged = this.sessions.get('logged');
      console.log("NoAuth",statusLogged)
      if (statusLogged == false || statusLogged===undefined || statusLogged===null) {
        return true;
      }
      this.svc.goRoute('/dashboard');
      return false;
  }
}
