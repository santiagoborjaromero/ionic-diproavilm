import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionSheetController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Headers } from '../helpers/headers.helper';
import Swal from 'sweetalert2';
import { Encryption } from '../helpers/encryption.helper';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private readonly http = inject(HttpClient);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly toasCtrl = inject(ToastController);
  private readonly router = inject(Router);
  private readonly headers = inject(Headers);
  private readonly loadingCtrl = inject(LoadingController);
  private readonly encrypt = inject(Encryption);
  private readonly navCtrl = inject(NavController);

  private base_url = "http://192.168.1.169/apidiproavilm/?ruta=";

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


  async showAlert(title: string = "", sub: string = "", cls: string = "error", buttons: any = []) {
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

  async goRoute(ruta: string = "") {
    this.router.navigate([`/${ruta}`], { replaceUrl: true, skipLocationChange: false});
    // this.navCtrl.navigateForward(ruta);
  }

  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let loading = await this.loadingCtrl.create({
      message: texto,
      duration: time,
      translucent: true,
      animated: true
    })
    loading.present();
  }

  

}
