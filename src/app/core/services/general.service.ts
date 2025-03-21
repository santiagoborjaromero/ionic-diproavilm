import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionSheetController, AlertController, IonicSafeString, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Headers } from '../helpers/headers.helper';
import Swal from 'sweetalert2';
import { Encryption } from '../helpers/encryption.helper';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly http = inject(HttpClient);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly alertCtrl = inject(AlertController);
  private readonly toasCtrl = inject(ToastController);
  private readonly router = inject(Router);
  private readonly headers = inject(Headers);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly encrypt = inject(Encryption);
  private readonly navCtrl = inject(NavController);

  private base_url = environment.apUrl;

  constructor() {
  }

  apiRest(method: string = "GET", ruta: string = "", body: any, pub: boolean = false): Observable<any> {
    let head = new HttpHeaders(pub ? this.headers.get() : this.headers.getWithToken());
    let options: any = {
      headers: head,
    }

    if (["POST", "PUT"].includes(method)){
      body = {
        data: this.encrypt.convertResponse(JSON.stringify(body))
      };
      // console.log(JSON.stringify(body))
    }

    switch (method) {
      case "POST":
        return this.http.post(`${this.base_url}${ruta}`, body, options);
      case "PUT":
        return this.http.put(`${this.base_url}${ruta}`, body, options);
      case "GET":
        return this.http.get(`${this.base_url}${ruta}&id=${body}`, options);
      case "DELETE":
        return this.http.delete(`${this.base_url}${ruta}&id=${body}`, options);
    }

    return this.http.post(`${this.base_url}${ruta}`, body, options);
  }

  async showToast(type: string = "info", mensaje: string, time: number = 2000) {
    let ctype: any = type == "info" ? 'secondary' : (type == "warning" ? 'warning' : 'danger');
    const Toast = await this.toasCtrl.create({
      message: mensaje,
      duration: time,
      mode: "ios",
      position: "bottom",
      color: ctype
    });
    Toast.present();
  }


  async showAlert(title: string = "", sub: string = "", cls: string = "error", buttons: Array<any> = []) {
    if (buttons.length==0){
      buttons = [{
        text: 'Aceptar',
        cssClass: 'alert-button-confirm',
      }]
    }
    const actionSheet = await this.alertCtrl.create({
      header: title,
      // subHeader: sub,
      message: sub,
      cssClass: `alert-${cls}`,
      mode: "ios",
      keyboardClose: false,
      buttons: buttons,
      htmlAttributes: {
        'aria-label': 'alert dialog',
      },
    });
    await actionSheet.present();
  }

  async goRoute(ruta: string = "") {
    this.router.navigate([`/${ruta}`], { replaceUrl: true, skipLocationChange: false});
    // this.navCtrl.navigateForward(ruta);
  }

  async showLoading(texto: string = "Espere un momento", time: number = 0) {
    let params:any = {};
    params["message"] = texto;
    if (time>0) params["duration"] = time;
    params["translucent"] = true;
    params["animated"] = true;
    params["mode"] = 'ios';
    params["spinner"] = 'circular';
    
    let loading = await this.loadingCtrl.create(params)
    loading.present();
    return loading;
  }

  

}
