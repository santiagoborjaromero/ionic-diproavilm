import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Headers } from '../helpers/headers.helper';
import Swal from 'sweetalert2';

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

  private base_url = "http://192.168.1.169/apidiproavilm/?ruta=";

  constructor() {
  }

  apiRest(method: string = "GET", ruta: string = "", body: any, pub: boolean = false): Observable<any> {
    let head = new HttpHeaders(pub ? this.headers.get() : this.headers.getWithToken());
    let options: any = {
      headers: head,
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
    this.router.navigate([`/${ruta}`], { replaceUrl: true, skipLocationChange: false });
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

  loading(text = '', time = 0) {
    let timerInterval: any;
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      title: text,
      text: "Espere un momento",
      footer: "Diproavilm",
      // showClass: { backdrop: 'swal2-noanimation', popup: '' }, hideClass: { popup: '' },
      didOpen: () => {
        Swal.showLoading();
        if (time > 0) {
          timerInterval = setInterval(() => {
            const content = Swal.getHtmlContainer();
            if (content) {
              const b: any = content.querySelector('b');
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 100);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result: any) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  }

  closeSwal(){
    if (Swal.isVisible()) Swal.close();
  }

}
