import { Injectable } from '@angular/core';
import { Global } from '../config/global.config';

@Injectable({
  providedIn: 'root'
})
export class Address {
  constructor() {}
    getapiUrl = ():string  =>  {
      let url = Global.api_db;
      return url;
    }
}
