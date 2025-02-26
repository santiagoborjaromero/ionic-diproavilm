import { Injectable, inject } from '@angular/core';
import { Encryption } from './encryption.helper';
import { Global } from '../config/global.config';


@Injectable({
  providedIn: 'root'
})
export class Sessions {
  private readonly encryp = inject(Encryption);

  clear = async () => {
    await sessionStorage.clear();
  }

  get  = (key:string) => {
    const value = sessionStorage.getItem(Global.prefix_storage + key);
    if (value){
      let base64 = (value);
      let desencriptado = this.encryp.decrypt(base64);
      let json =  JSON.parse(desencriptado);
      return  json;
    }
  }

  set = (key:string, data:any)  => {
    let value = (this.encryp.encryp(JSON.stringify(data))); 
    sessionStorage.setItem(Global.prefix_storage + key, value);
  }


}