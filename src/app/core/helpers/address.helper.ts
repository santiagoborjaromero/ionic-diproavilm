import { Injectable } from '@angular/core';
import { Global } from '../config/global.config';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class Address {
  constructor() {}
    getapiUrl = ():string  =>  {
      let url = environment.apUrl;
      return url;
    }
}
