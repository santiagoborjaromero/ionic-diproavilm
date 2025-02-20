import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CreatepassPage } from '../createpass/createpass.page';
import { ChangepassPage } from '../changepass/changepass.page';
import { GeneralService } from 'src/app/core/services/general.service';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {
  private readonly modalCtrl = inject(ModalController);
  private readonly service = inject(GeneralService);
  private readonly sess = inject(Sessions);
  private readonly router = inject(Router);
  private readonly actionSheetController = inject(ActionSheetController);

  public username: string = "";
  public password: string = "";
  public current_year: number = new Date().getFullYear();
  public bloqueo: boolean = false;
  public times_error: number = 0;

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
      // this.service.showToast("error", errMsg)
      this.service.showAlert(errMsg, "", "error", [
        {
          text: 'Aceptar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]);
      // const actionSheet = await this.actionSheetController.create({
      //   header: errMsg,
      //   // subHeader: 'Autorización',
      //   cssClass: "alert-error",
      //   mode: "ios",
      //   keyboardClose: true,
      //   buttons: [
      //     {
      //       text: 'Aceptar',
      //       role: 'cancel',
      //       data: {
      //         action: 'cancel',
      //       },
      //     },
      //   ],
      // });
      // await actionSheet.present();
      return;
    }

    let frmData = {
      username: this.username,
      password: this.password,
      app: "movil"
    }

    await this.service.apiRest("POST", "login", frmData, true).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          let user = resp.message[0];
          this.sess.set("user", user);
          this.sess.set("token", user.token);
          this.sess.set("form", frmData);
          this.sess.set("logged", true);
          this.service.goRoute("dashboard");
          // this.router.navigate(["/dashboard"], { replaceUrl: true, skipLocationChange: false })
        } else {
          this.times_error++;
          switch(resp.message){
            case "establecer clave":
              this.service.showToast("error", "Debe establecer una contraseña.")
              setTimeout(() => {
                this.restablecerClave();
              }, 2000)
              return; 
          }

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
      error: (err) => {
        this.service.showAlert(err, "", "error", [
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
    await this.service.apiRest("POST", "bloquearUsuario", {username: this.username, app:"movil"}, true).subscribe({
      next: (resp)=>{
        console.log(resp)
        this.service.showToast("error","username se encuentra bloqueado" );
        this.bloqueo = true;
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.times_error++;
        this.service.showToast("error", error)
      }
    })
  }

  restablecerClave = async () => {
    this.router.navigate(['/createpass'], { replaceUrl: true, skipLocationChange: false })
    // const modal = await this.modalCtrl.create({
    //   component: CreatepassPage,
    //   mode: "ios",
    // })
    // return await modal.present();
  }

  changeClave = async () => {
    this.router.navigate(['/changepass'], { replaceUrl: true, skipLocationChange: false })
    // const modal = await this.modalCtrl.create({
    //   component: ChangepassPage,
    //   mode: "ios",
    // })
    // return await modal.present();
  }

}
