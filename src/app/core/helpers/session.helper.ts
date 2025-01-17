import { Injectable, inject } from '@angular/core';
import { Global } from '../config/global.config';
import { Encryption } from './encryption.helper';
// import {CookieService} from 'angular2-cookie/core';
// import { CookieService } from 'ngx-cookie-service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class Sessions {
  private readonly encryp = inject(Encryption);
  // private readonly cookieService = inject(CookieService);

  // constructor(
  //   private encryp: Encryption,
  //   private cookieService: CookieService
  // ) {}

  clear = () => {
    Preferences.clear();
  }

  get = async (key:string) => {
    key = Global.prefix_storage + key;
    return await Preferences.get({key: key });
  }

  set = (key:string, value:any) => {
    key = Global.prefix_storage + key;
    Preferences.set({key, value});
  }

  // get = (key:string) => {
  //   let content: any ;
  //   try {
  //     content = this.encryp.decrypt(sessionStorage.getItem(`${Global.prefix_storage}${key}`));
  //   } catch (ex) {
  //     content = sessionStorage.getItem(key);
  //   }
  //   return content;
  // };

  // getCookie = (key:any) => {
  //   let content: string = '';
  //   try {
  //     content = this.encryp.decrypt(this.cookieService.get(`${Global.prefix_storage}${key}`));
  //     // content = this.encryp.decrypt(sessionStorage.getItem(`${Global.prefix_storage}${key}`));
  //   } catch (ex) {
  //     content = this.cookieService.get(key);
  //   }
  //   return content;
  // };

  // set = (key:any, data:any): void => {
  //   try {
  //     sessionStorage.setItem(`${Global.prefix_storage}${key}`,this.encryp.encryp(data));
  //     this.cookieService.set( `${Global.prefix_storage}${key}`, this.encryp.encryp(data)); // To Set Cookie
  //   } catch (ex) {}
  // };
}
