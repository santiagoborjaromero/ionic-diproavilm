import { Injectable, inject } from '@angular/core';
import { Encryption } from './encryption.helper';


@Injectable({
  providedIn: 'root'
})
export class Sessions {
  private readonly encryp = inject(Encryption);

  clear = async () => {
    await sessionStorage.clear();
  }

  get  = (key:string) => {
    const value = sessionStorage.getItem(key);
    if (value){
      return JSON.parse(this.encryp.decrypt(atob(value)));
    }
  }

  set = (key:string, data:any)  => {
    let value = btoa(this.encryp.encryp(JSON.stringify(data))); 
    sessionStorage.setItem(key, value);
  }

  // clear = async (): Promise<any> => {
  //   await Preferences.clear();
  // }

  // get  = async (key:string): Promise<any>  => {
  //   const { value } = await Preferences.get({key});
  //   if (value){
  //     return JSON.parse(this.encryp.decrypt(atob(value)));
  //   }
  // }

  // set = async (key:string, data:any): Promise<any>  => {
  //   let value = btoa(this.encryp.encryp(JSON.stringify(data))); 
  //   await Preferences.set({key, value});
  // }

}
