import { Component, OnInit, inject } from '@angular/core';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  private readonly func = inject(Functions);

  public user: any = {};


  public nombre_usuario:string = "";
  public rol_usuario:string = "";
  
  
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
  public scope: Array<any>=[];

  public scopeR:boolean=false;
  public scopeW:boolean=false;
  public scopeD:boolean=false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);

    this.username = this.user.username;
    this.nombre_usuario = this.user.fullname;
    this.rol_usuario = this.user.role[0].name;

    this.scope = this.user.role[0].scope.split("");

    if (this.scope.includes("R")) this.scopeR = true;
    if (this.scope.includes("W")) this.scopeW = true;
    if (this.scope.includes("D")) this.scopeD = true;

    if (!this.scopeR){
      this.svc.showToast("error", "Su rol asignado no le permite visualizar esta información.")
      return;
    }
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

    let datos = {
      username: this.username,
      password_old: this.old_password,
      password_new: this.password,
      app: "movil"
    }

    await this.svc.apiRest("POST", "cambioclave", datos, true).subscribe({
      next: (resp) => {
        if (resp.status=="ok") {
          this.svc.showToast("info", "Contraseña cambiada con éxito")
        } else {
          this.svc.showAlert(resp.message, "", "error", [
            {
              text: 'Aceptar',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]);
          this.confirm_password = "";
          this.password = "";
        }
      },
      error: (error) => {
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

}
