import { Component, OnInit, inject } from '@angular/core';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {
  
  private readonly svc = inject(GeneralService);
  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);

  public title: string = "Usuarios";

  public user: any = {};
  public lstUsers: any = {};
  public lstUsersOriginal: any = {};
  public buscar: string ="";
  public userID: string ="";

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy")
    this.lstUsers = [];
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit")
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);
    // this.svc.showLoading();
    // this.svc.loading("Espere un momento");
    setTimeout(()=>{
      this.getData(true);
    },800)
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
  }
  
  getData = async (load:boolean = false) => {
    if (load) this.svc.showLoading("Espere un momento", 1000);
    this.svc.apiRest("GET", "users", null).subscribe({
      next: (resp:any)=>{
        if (resp.status == "ok"){
          this.lstUsers = resp.message;
          this.lstUsersOriginal = resp.message;
          // console.log(this.lstUsers)
        }else{
          this.svc.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
        this.svc.showAlert(error, "", "error", [{text: 'Aceptar',role: 'cancel',data: {action: 'cancel',},},]);
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
    console.log("new");
    this.userID = "-1";
    this.svc.goRoute(`/user/${this.userID}`)
  }
  edit(id:any){
    console.log("edit");
    this.userID = id;
    this.svc.goRoute(`/user/${this.userID}`)
  }
  del = async (id:any) => {
    Swal.fire({
      title: this.title,
      text: `Desea eliminar el registro?`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      heightAuto:false,
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.eliminar(id);
      }
    });
  }

  eliminar = async (id:string) => {
    await this.svc.apiRest("DELETE", "deleteUser", id).subscribe({
      next: (resp)=>{
        // console.log(resp)
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  recuperar =  async (id:any) => {
    Swal.fire({
      title: this.title,
      text: `Desea recuperar el registro?`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      heightAuto:false,
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.recovery(id);
      }
    });
  }
  
  recovery =  async (id:any) => {
    await this.svc.apiRest("POST", `recuperarUsuario&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }


  reestablecerClave = async (id:any) => {
    Swal.fire({
      title: this.title,
      text: `Desea restablecer la contraseña del registro`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      heightAuto:false,
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.reset(id);
      }
    });
  }

  reset= async (id:any) => {
    await this.svc.apiRest("POST", `resetearclave&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

}
