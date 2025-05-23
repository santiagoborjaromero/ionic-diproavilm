import { Injectable } from '@angular/core';
import { Encryption } from './encryption.helper';
import { Sessions } from '../helpers/session.helper';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Headers {
  constructor(private encryp: Encryption, private sessions: Sessions) { }
  getWithToken = (mas:boolean = false) => {
    let token: string = this.sessions.get("token");
    let h:any = {};
    if (mas) h["Access-Control-Allow-Origin"] = `*`;
    if (mas) h["Access-Control-Allow-Methods"] = `GET, POST, OPTIONS, DELETE`;
    if (mas) h["Access-Control-Allow-Headers"] = `Accept,Accept-Language,Content-Language,Content-Type`;
    if (mas) h["Access-Control-Expose-Headers"] = `Content-Length,Content-Range`;
    h["Content-Type"] = 'application/json';
    h["Authorization"] = `Bearer ${token}`;
    return h
  }

  get = () => {
    return { "Content-Type": 'application/json' };
  }
}


/**
 * 
     'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
      'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
 * 
 * 
 */