import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Address } from '../helpers/address.helper';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly http = inject(HttpClient);
  private readonly toasCtrl = inject(ToastController);
  
  public headers: any
  public token: any;

  public base_url = "http://192.168.1.169/apidiproavilm/?ruta=";

  constructor() { 
  }
  
  login(data:any): Observable<any> {
    // this.headers = this.headerHlp.get('');
    this.headers = {
      "Content-Type": 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
      'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
    };
    let options = {
      headers: this.headers
    };
    return this.http.post<any>(`${this.base_url}login`, data, options);
  }
}
