import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../helpers/address.helper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public base_url: string
  public headers: any
  public token: any;

  private readonly http = inject(HttpClient);
  // private readonly injector = inject(EnvironmentInjector);
  // private readonly encrpt = inject(Encryption);
  // private readonly encrouterrpt = inject(Router);
  private readonly headerHlp = inject(Headers);
  private readonly addr = inject(Address);

  constructor() { 
    this.base_url = this.addr.getapiUrl();
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
