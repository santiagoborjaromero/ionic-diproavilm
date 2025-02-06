import { Injectable, inject } from '@angular/core';
import { Encryption } from './encryption.helper';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class Sessions {
  private readonly encryp = inject(Encryption);

  clear = async (): Promise<any> => {
    await Preferences.clear();
  }

  get  = async (key:string): Promise<any>  => {
    const { value } = await Preferences.get({key});
    if (value){
      return JSON.parse(atob(value));
    }
  }

  set = async (key:string, data:any): Promise<any>  => {
    let value = btoa(JSON.stringify(data)); 
    await Preferences.set({key, value});
  }

  async closeSession(){
    sessionStorage.clear();
  }

}
