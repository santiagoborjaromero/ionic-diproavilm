import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sessions } from '../../core/helpers/session.helper';
import { GeneralService } from '../../core/services/general.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Functions } from 'src/app/core/helpers/functions.helper';


@Component({
  selector: 'app-createpass',
  templateUrl: './createpass.page.html',
  styleUrls: ['./createpass.page.scss'],
  standalone: false
})
export class CreatepassPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sess = inject(Sessions);
  private readonly modalCtrl = inject(ModalController);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly service = inject(GeneralService)
  private readonly loadingCtrl = inject(LoadingController)
  private readonly func = inject(Functions);
  
  public username: string = "";
  public password: string = "";
  public confirm_password: string = "";
  public seguridad_pass: boolean = false;
  public saving: boolean = false;
  public current_year: number = new Date().getFullYear();
  public times_error: number = 0;
  public bloqueo: boolean = false;
  public minLength: number = 8;
  public arrSecurity: Array<any> = this.func.arrSecurityPassword();

  constructor(
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.clean();
  }

  clean() {
    this.username = "";
    this.password = "";
    this.confirm_password = "";
    this.seguridad_pass = false;
  }

  keyPass(event:any){
    let result:any = this.func.checkStrongPassword(this.password);  
    this.arrSecurity[0].value = result[0];
    this.arrSecurity[1].value = result[1];
    this.arrSecurity[2].value = result[2];
    this.arrSecurity[3].value = result[3];
    this.arrSecurity[4].value = result[4];
    this.arrSecurity[5].value = result[5];
    this.seguridad_pass = result[6];
  }

  async sendData() {
    let errMsg = "";
    let error: boolean = false;

    this.saving = true;

    if (this.username == "") {
      errMsg = "Debe llenar el nombre del usuario";
      error = true;
    }

    // let pattern = /^[a-zA-Z0-9]$/;
    // if (!error && !pattern.test(this.username)) {
    //   errMsg = "El usuario debe estar compuesto por mayusculas, minusculas y numeros.";
    //   error = true;
    // }

    if (!error && this.password == "") {
      errMsg = "Debe llenar la nueva contraseña";
      error = true;
    }

    if (!error && this.confirm_password == "") {
      errMsg = "Debe llenar la contraseña de confirmación";
      error = true;
    }

    if (!error && this.password !== this.confirm_password) {
      errMsg = "La contraseña nueva y la confirmación deben ser iguales";
      error = true;
    }
    
    let fuerza = this.func.checkStrongPassword(this.password);
    if (!error && !fuerza[6]){
      errMsg = "La contraseña debe estar compuesta de mayúsculas, minúsculas, números y símbolos, con una longitud mínima de 8 caracteres";
      error = true;
    }

    if (error) {
      // this.service.showToast("error", errMsg)
      this.saving = false;
      this.service.showAlert(errMsg, "", "error", [
        {
          text: 'Aceptar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]);
      return
    }


    // this.showLoading("Cargando", 1000);

    let datos = {
      username: this.username,
      password_new: this.password,
      app: "movil"
    }

    await this.service.apiRest("POST", "establecerclave", datos, true).subscribe({
      next: (resp) => {
        this.saving = false;
        if (resp.status=="ok") {
          this.service.showToast("info", resp.message)
          this.regresar();
        } else {
          this.times_error++;
          // console.log("times_error", tis.times_error)
          if (this.times_error == 3) {
            this.bloqueo = true;
            this.bloquearusername();
          } else {
            // this.service.showToast("error", resp.message)
            this.service.showAlert(resp.message, "", "error", [
              {
                text: 'Aceptar',
                role: 'cancel',
                data: {
                  action: 'cancel',
                },
              },
            ]);
            setTimeout(() => {
              this.service.showToast("error", "Le quedan " + (3 - this.times_error) + " intento(s).")
            }, 2000)
          }
        }
      },
      error: (error) => {
        this.saving = false;
        this.times_error++;
        console.log("ERROR", error)
        this.service.showToast("error", error)
      }
    })
  }

  bloquearusername = async () => {
    await this.service.apiRest("POST", "bloquearUsuario", {username: this.username, app:"movil"}, true).subscribe({
      next: (resp)=>{
        // console.log(resp)
        this.service.showToast("error","username se encuentra bloqueado" );
        this.regresar();
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.times_error++;
        this.service.showToast("error", error)
      }
    })
  }

  regresar() {
    this.router.navigate(["/login"], { replaceUrl: true, skipLocationChange: false });
  }


  async showLoading(texto: string, time: number = 0) {
    let loading = await this.loadingCtrl.create({
      message: texto,
      duration: time
    })
    loading.present();
  }


}
