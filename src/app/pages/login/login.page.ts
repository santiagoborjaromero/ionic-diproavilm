import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  private readonly svc = inject(GeneralService);
  private readonly sess = inject(Sessions);
  private readonly loadingCtrl = inject(LoadingController);

  public username: string = "";
  public password: string = "";
  public current_year: number = new Date().getFullYear();
  public bloqueo: boolean = false;
  public times_error: number = 0;
  public loading: any;

  constructor() { }

  ngOnInit() {
    // console.log("OnInit")
  }

  ngOnDestroy(): void {
    // console.log("destroy")
    this.username = "";
    this.password = "";
  }

  ngAfterViewInit(): void {
    // console.log("AfterViewInit")
    this.initial();
  }

  initial() {
    this.sess.clear()
    this.sess.set("user", "");
    this.sess.set("token", "");
    this.sess.set("form", "frmData");
    this.sess.set("logged", false);
    this.username = "";
    this.password = "";
  }

  signin = async () => {
    let errMsg = "";
    let error: boolean = false;

    if (this.username == "") {
      errMsg = "Debe llenar el usuario";
      error = true;
    }

    if (!error && this.password == "") {
      errMsg = "Debe llenar la contraseña";
      error = true;
    }

    if (error) {
      this.svc.showAlert(errMsg, "", "error", [
        {
          text: 'Aceptar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]);

      return;
    }

    let frmData = {
      username: this.username,
      password: this.password,
      app: "movil"
    };

    this.showLoading("Verificando Usuario",1000)

    await this.svc.apiRest("POST", "login", frmData, true).subscribe({
      next: (resp) => {
        try{this.loading.dismiss();}catch(ex){}

        if (resp.status == "ok") {
          let user = resp.message[0];
          this.sess.set("user", user);
          this.sess.set("token", user.token);
          this.sess.set("form", frmData);
          this.sess.set("logged", true);
          this.svc.goRoute("verificacion");
        } else {
          this.times_error++;
          switch(resp.message){
            case "establecer clave":
              this.svc.showAlert("Debe establecer una contraseña.", "", "info", [
                {
                  text: 'Aceptar',
                  role: 'cancel',
                  data: {
                    action: 'cancel',
                  },
                },
              ]);
              setTimeout(() => {
                this.restablecerClave();
              }, 2000)
              return; 
              break;
            case "password expirado":
              this.svc.showAlert("Su contraseña ha expirado, debe cambiar la contraseña.", "", "error", [
                {
                  text: 'Aceptar',
                  role: 'cancel',
                  data: {
                    action: 'cancel',
                  },
                },
              ]);
              setTimeout(() => {
                this.changeClave();
              }, 2000)
              return; 
              break;
          }

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
      error: (err) => {
        console.log("Error",err)
        try{this.loading.dismiss();}catch(ex){}
        this.svc.showAlert(err, "", "error", [
          {
            text: 'Aceptar',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]);

      }
    })
  }

  bloquearusername = async () => {
    await this.svc.apiRest("POST", "bloquearUsuario", {username: this.username, app:"movil"}, true).subscribe({
      next: (resp)=>{
        // console.log(resp)
        this.svc.showToast("error","username se encuentra bloqueado" );
        this.bloqueo = true;
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.times_error++;
        this.svc.showToast("error", error)
      }
    })
  }

  restablecerClave = async () => {
    this.svc.goRoute("createpass");
  }

  changeClave = async () => {
    this.svc.goRoute("changepass");
  }


  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

}
