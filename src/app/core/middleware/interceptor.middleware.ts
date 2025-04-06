import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sessions } from '../helpers/session.helper';
import { Encryption } from '../helpers/encryption.helper';
import { environment } from 'src/environments/environment.prod';


@Injectable()
export class Transmission implements HttpInterceptor {

  private readonly encr =  inject(Encryption);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // return next.handle(request);
    return next.handle(request).pipe(
      map((event)=>{
        if (event instanceof HttpResponse){
          let message = event.body.message;
          if(environment.debug) console.log(message)
          let convert = this.encr.convertRequest(message);
          event.body.message = convert;
          if(environment.debug) console.log(event.body)
        }
        if (event instanceof HttpRequest){
          console.log("REQUEST", event)
        }
        return event
      })

    );
  }
}



// import { Injectable } from '@angular/core';
//     import {
//       HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
//     } from '@angular/common/http';
    
//     @Injectable({
//       providedIn: 'root'
//     })
//     export class NameInterceptor implements HttpInterceptor {
//       intercept(req: HttpRequest<any>, next: HttpHandler) {
//         return next.handle(req);
//       }
//     }, useClass: IonicRouteStrategy }
