import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {
  
  private readonly alertController = inject(AlertController);
  private readonly router = inject(Router);
  private readonly service = inject(GeneralService);
  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);

  public tilte: string = "Usuarios";

  public user: any = {};
  public lstUsers: any = {};
  public lstUsersOriginal: any = {};
  public buscar: string ="";
  public userID: string ="";

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.lstUsers = [];
  }

  ngAfterViewInit(): void {
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);
    this.service.showLoading();
    setTimeout(()=>{
      this.getData();
    },800)
  }
  
  getData = async (load:boolean = false) => {
    if (load) this.service.showLoading();
    this.service.apiRest("GET", "users", null).subscribe({
      next: (resp:any)=>{
        if (resp.status == "ok"){
          this.lstUsers = resp.message;
          this.lstUsersOriginal = resp.message;
          // console.log(this.lstUsers)
        }else{
          this.service.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
        this.service.showAlert(error, "", "error", [{text: 'Aceptar',role: 'cancel',data: {action: 'cancel',},},]);
      }
    })
  }

  find = (event:any) => {
    if (this.buscar==""){
      this.lstUsers = Array.from(this.lstUsersOriginal);
    }else{
      this.lstUsers = [];
      this.lstUsersOriginal.forEach((e:any)=>{
        if (
          e.fullname.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.username.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.rolename.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 
        ){
          this.lstUsers.push(e)
        }
      })
    }

  }

  seleccionarID(id:any){
    this.userID = id;
  }
  new(){
    this.userID = "-1";
    this.router.navigate([`/user/${this.userID}`],  { replaceUrl: true, skipLocationChange: true })
  }
  edit(id:any){
    this.userID = id;
    this.router.navigate([`/user/${this.userID}`],  { replaceUrl: true, skipLocationChange: true })
  }
  del = async (id:any) => {
    const alert = await this.alertController.create({
      header: this.tilte,
      subHeader: "Desea eliminar el registro",
      mode: "ios",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Si, Eliminar',
          role: 'confirm',
          handler: () => {
            this.eliminar(id);
          },
        },
      ],
    });
    alert.present()
  }

  eliminar = async (id:string) => {
    await this.service.apiRest("DELETE", "deleteUser", id).subscribe({
      next: (resp)=>{
        console.log(resp)
        if (resp.status=="ok"){
          this.service.showToast("info", resp.message)
          this.getData();
        } else{
          this.service.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.service.showToast("error", error)
      }
    })
  }

  recuperar =  async (id:any) => {
    const alert = await this.alertController.create({
      header: this.tilte,
      subHeader: "Desea recuperar el registro",
      mode: "ios",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Si, Recuperar',
          role: 'confirm',
          handler: () => {
            this.recovery(id);
          },
        },
      ],
    });
    alert.present()
  }
  
  recovery =  async (id:any) => {
    await this.service.apiRest("POST", `recuperarUsuario&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.service.showToast("info", resp.message)
          this.getData();
        } else{
          this.service.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.service.showToast("error", error)
      }
    })
  }


  reestablecerClave = async (id:any) => {
    const alert = await this.alertController.create({
      header: this.tilte,
      subHeader: "Desea restablecer la contraseña del registro",
      mode: "ios",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'Si, Restablecer',
          role: 'confirm',
          handler: () => {
            this.reset(id);
          },
        },
      ],
    });
    alert.present()
  }

  reset= async (id:any) => {
    await this.service.apiRest("POST", `resetearclave&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.service.showToast("info", resp.message)
          this.getData();
        } else{
          this.service.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.service.showToast("error", error)
      }
    })
  }

}
