import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sessions } from '../../core/helpers/session.helper';
import { GeneralService } from '../../core/services/general.service';
import { LoadingController, ModalController } from '@ionic/angular';



@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.page.html',
  styleUrls: ['./changepass.page.scss'],
  standalone: false
})
export class ChangepassPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sess = inject(Sessions);
  private readonly modalCtrl = inject(ModalController);
  private readonly service = inject(GeneralService)
  private readonly loadingCtrl = inject(LoadingController)


  public username: string ="";
  public password: string ="";
  public old_password: string ="";
  public confirm_password: string ="";
  public seguridad_pass: string = "";
  public current_year:number = new Date().getFullYear();
  public times_error: number = 0;
  public bloqueo: boolean = false;

  constructor(
    // private svc:GeneralService
  ) { }

  ngOnInit() {
    this.sess.set("logged",{value: false})
    this.clean();
  }

  ngOnDestroy(): void {
    this.clean();
  }
  
  clean(){
    this.username = "";
    this.password = "";
    this.confirm_password = "";
    
  }

  async sendData(){
    let errMsg = "";
    let error:boolean = false;

    if (this.username == ""){
      errMsg = "Debe llenar el la cédula de identidad";
      error = true;
    }

    
    if (!error && this.password == ""){
      errMsg = "Debe llenar la contraseña";
      error = true;
    }
    
    if (error){
      this.service.showToast("error", errMsg)
      return
    }

    this.showLoading("Cargando",1000);
    
    let datos = {
      ci_persona: this.username,
      clave_persona: this.password
    }

    await this.service.apiRest("POST", "login", datos).subscribe({
      next: (resp)=>{
        
        if (resp.status){
          let data = resp.data[0];
          this.sess.set("user", data);
          this.sess.set("logged", true);
          this.router.navigate(["/dash"]);
          this.username = "";
          this.password = "";
        } else{
          this.times_error++;
          if (this.times_error == 3){
            console.log("ERROR", resp.message)
            this.bloquearusername();
            this.bloqueo = true;
          } else {
            this.service.showToast("error", resp.message)
            setTimeout(()=>{
              this.service.showToast("error","Le quedan " + (3 - this.times_error) + " intento(s)." )
            },2000)
          }
        }
      },
      error: (error)=>{
        this.times_error++;
        console.log("ERROR", error)
        this.service.showToast("error", error)
      }
    })
  }

  bloquearusername = async () => {
    await this.service.apiRest("POST", "bloquear", {ci_persona: this.username}).subscribe({
      next: (resp)=>{
        this.service.showToast("error","username se encuentra bloqueado" )
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.times_error++;
        this.service.showToast("error", error)
      }
    })
  }
  
  regresar(){
    this.router.navigate(["/login"],  { replaceUrl: true, skipLocationChange: false });
    // return this.modalCtrl.dismiss(null, 'cancel');
  }

  async showLoading(texto: string, time:number = 0){
    let loading = await this.loadingCtrl.create({
      message: texto,
      duration: time
    })
    loading.present();
  }
  

}
