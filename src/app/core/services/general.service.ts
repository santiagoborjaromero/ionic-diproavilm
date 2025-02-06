import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Address } from '../helpers/address.helper';
import { Observable } from 'rxjs';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Headers } from '../helpers/headers.helper';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly http = inject(HttpClient);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly toasCtrl = inject(ToastController);
  private readonly router = inject(Router);
  private readonly headers = inject(Headers);
  
  // private publicHeaders: any;
  // private privateHeaders: any;
  // private token: any;

  private base_url = "http://192.168.1.169/apidiproavilm/?ruta=";

  constructor() { 
    
    // this.publicHeaders = { "Content-Type": 'application/json' };
  }

  // setPrivateHeaders(){
  //   this.privateHeaders = {
  //     "Content-Type": 'application/json',
  //     "Authorization": `Bearer ${this.token}`,
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
  //     'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
  //     'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
  //   };
  // }
  
  // login(data:any): Observable<any> {
  //   // this.headers = this.headerHlp.get('');
  //   this.headers = {
  //     "Content-Type": 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS, DELETE',
  //     'Access-Control-Allow-Headers': 'Accept,Accept-Language,Content-Language,Content-Type',
  //     'Access-Control-Expose-Headers': 'Content-Length,Content-Range',
  //   };
  //   let options = {
  //     headers: this.headers
  //   };
  //   return this.http.post<any>(`${this.base_url}login`, data, options);
  // }

  apiRest( method:string = "GET",ruta:string="",body:any, pub:boolean = false): Observable<any>{
    let head = new HttpHeaders(pub ? this.headers.get() : this.headers.getWithToken());
    let options:any = {
      headers: head,
    }

    switch (method){
      case "POST":
        return this.http.post(`${this.base_url}${ruta}`, body, options);
      case "PUT":
        return this.http.put(`${this.base_url}${ruta}`, body, options);
      case "GET":
        return this.http.get(`${this.base_url}${ruta}&id=${body}`, options);
      case "DELETE":
        return this.http.delete(`${this.base_url}${ruta}&id=${body}`, body);
    }

    return this.http.post(`${this.base_url}${ruta}`, body, options);
  }

  async showToast(type:string =  "info", mensaje:string, time:number = 2000){
    const Toast = await this.toasCtrl.create({
      message: mensaje,
      duration: time,
      mode: "ios",
      position: "top"
    });
    Toast.present();
  }


  async showAlert(title:string="", sub:string ="", cls:string="error", buttons:any = []){
    const actionSheet = await this.actionSheetController.create({
      header: title,
      subHeader: sub,
      cssClass: `alert-${cls}`,
      mode: "ios",
      keyboardClose: true,
      buttons: buttons
    });
    await actionSheet.present(); 
  }

  async goRoute(ruta:string=""){
    this.router.navigate([`/${ruta}`], { replaceUrl: true, skipLocationChange: false });
  }

}
