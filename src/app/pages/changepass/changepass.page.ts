import { Component, OnInit, inject } from '@angular/core';
import { GeneralService } from '../../core/services/general.service';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.page.html',
  styleUrls: ['./changepass.page.scss'],
  standalone: false
})
export class ChangepassPage implements OnInit {
  private readonly svc = inject(GeneralService)
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
  public old_password: string ="";

  constructor(
    // private svc:GeneralService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.clean();
  }
  
  clean(){
    this.username = "";
    this.password = "";
    this.old_password = "";
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

    if (!error && this.old_password == "") {
      errMsg = "Debe llenar la contraseña anterior";
      error = true;
    }

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
      // this.svc.showToast("error", errMsg)
      this.saving = false;
      this.svc.showAlert(errMsg, "", "error", [
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
      password_old: this.old_password,
      password_new: this.password,
      app: "movil"
    }

    await this.svc.apiRest("POST", "cambioclave", datos, true).subscribe({
      next: (resp) => {
        this.saving = false;
        if (resp.status=="ok") {
          this.svc.showToast("info", "Contraseña cambiada con éxito")
          this.regresar();
        } else {
          this.times_error++;
          // console.log("times_error", tis.times_error)
          if (this.times_error == 3) {
            this.bloqueo = true;
            this.bloquearusername();
          } else {
            // this.svc.showToast("error", resp.message)
            this.svc.showAlert(resp.message, "", "error", [
              {
                text: 'Aceptar',
                role: 'cancel',
                data: {
                  action: 'cancel',
                },
              },
            ]);
            setTimeout(() => {
              this.svc.showToast("error", "Le quedan " + (3 - this.times_error) + " intento(s).")
            }, 2000)
          }
        }
      },
      error: (error) => {
        this.saving = false;
        this.times_error++;
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  bloquearusername = async () => {
    await this.svc.apiRest("POST", "bloquearUsuario", {username: this.username, app:"movil"}, true).subscribe({
      next: (resp)=>{
        // console.log(resp)
        this.svc.showToast("error","username se encuentra bloqueado" );
        this.regresar();
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.times_error++;
        this.svc.showToast("error", error)
      }
    })
  }

  regresar() {
    this.svc.goRoute("login")
  }


  async showLoading(texto: string, time: number = 0) {
    let loading = await this.loadingCtrl.create({
      message: texto,
      duration: time
    })
    loading.present();
  }
  

}
