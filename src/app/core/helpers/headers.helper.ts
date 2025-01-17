import { Injectable } from '@angular/core';
import { Encryption } from './encryption.helper';
import { Sessions } from '../helpers/session.helper';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Headers {
  constructor(private encryp: Encryption, private sessions: Sessions) {}
	getWithToken = () => {
        let token = this.sessions.get("token");
        // console.log(token)
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
            'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
        };
    }
    get = () => {
        return new HttpHeaders({
            "Content-Type": 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
            'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
        });
    }
}
