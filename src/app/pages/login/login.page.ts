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

  public username:string = "";
  public password:string = "";
  public current_year:number = new Date().getFullYear();


  constructor() { }

  ngOnInit() {
    console.log("OnInit")
  }

  ngOnDestroy(): void {
    console.log("destroy")
    this.username = "";
    this.password = "";
  }

  ngAfterViewInit(): void {
    console.log("AfterViewInit")
    this.initial();
  }

  initial(){
    this.sess.set("user", "");
    this.sess.set("token", "");
    this.sess.set("form", "frmData");
    this.sess.set("logged", false);
    this.username = "";
    this.password = "";
  }

  signin = async () => {
    let errMsg = "";
    let error:boolean = false;

    if (this.username == ""){
      errMsg = "Debe llenar el usuario";
      error = true;
    }

    
    if (!error && this.password == ""){
      errMsg = "Debe llenar la contraseña";
      error = true;
    }
    
    if (error){
      // this.service.showToast("error", errMsg)
      this.service.showAlert(errMsg,"","error",[
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

    await this.service.apiRest("POST","login", frmData, true).subscribe({
      next: (resp) => {
        if (resp.status=="ok"){
          let user = resp.message[0];
          this.sess.set("user", user);
          this.sess.set("token", user.token);
          this.sess.set("form", frmData);
          this.sess.set("logged", true);
          this.service.goRoute("dashboard");
          // this.router.navigate(["/dashboard"], { replaceUrl: true, skipLocationChange: false })
        }else{
          this.service.showAlert(resp.message,"","error",[
            {
              text: 'Aceptar',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]);
        }
      },
      error: (err) => {
        this.service.showAlert(err,"","error",[
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

  restablecerClave = async () => {
    this.router.navigate(['/createpass'],  { replaceUrl: true, skipLocationChange: false })
    // const modal = await this.modalCtrl.create({
      //   component: CreatepassPage,
      //   mode: "ios",
      // })
      // return await modal.present();
    }
    
    changeClave = async () => {
    this.router.navigate(['/changepass'],  { replaceUrl: true, skipLocationChange: false })
    // const modal = await this.modalCtrl.create({
    //   component: ChangepassPage,
    //   mode: "ios",
    // })
    // return await modal.present();
  }

}
