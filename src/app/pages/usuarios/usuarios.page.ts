import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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
  private readonly loadingCtrl = inject(LoadingController);

  public title: string = "Usuarios";

  public user: any = {};
  public lstUsers: any = {};
  public lstUsersOriginal: any = {};
  public buscar: string ="";
  public userID: string ="";
  public scope: Array<any>=[];
  public loading: any;

  public scopeR:boolean=false;;
  public scopeW:boolean=false;;
  public scopeD:boolean=false;;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    // console.log("ngOnDestroy")
    this.lstUsers = [];
    this.lstUsersOriginal = [];
  }

  ngAfterViewInit(): void {
    // console.log("ngAfterViewInit")
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);

    this.scope = this.user.role[0].scope.split("");

    if (this.scope.includes("R")) this.scopeR = true;
    if (this.scope.includes("W")) this.scopeW = true;
    if (this.scope.includes("D")) this.scopeD = true;

    if (!this.scopeR){
      this.svc.showToast("error", "Su rol asignado no le permite visualizar esta información.")
      return;
    }


    // this.svc.showLoading();
    // this.svc.loading("Espere un momento");
    setTimeout(()=>{
      this.getData(true);
    },800)
  }

  ionViewWillEnter() {
  }

  pagination(startIndex=0, endIndex=10){
    this.lstUsers = this.lstUsersOriginal.slice(startIndex, endIndex);
    // console.log("Paginado", this.lstUsers);
  }
  
  getData = async (load:boolean = false) => {
    this.showLoading("Espere un momento");
    this.svc.apiRest("GET", "users", null).subscribe({
      next: (resp:any)=>{
        // console.log("Llego", resp);
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status == "ok"){
          // console.log("Entro", resp);
          this.lstUsersOriginal = resp.message;
          this.pagination();
          setTimeout(()=>{
            this.pagination(0,this.lstUsersOriginal.length)
          },1000)
        }else{
          this.svc.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
        try{this.loading.dismiss();}catch(ex){}
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
    // console.log("new");
    this.userID = "-1";
    this.svc.goRoute(`/user/${this.userID}`)
  }
  edit(id:any){
    // console.log("edit");
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
    this.showLoading("Eliminando")
    await this.svc.apiRest("DELETE", "deleteUser", id).subscribe({
      next: (resp)=>{
        try{this.loading.dismiss();}catch(ex){}
        // console.log(resp)
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        try{this.loading.dismiss();}catch(ex){}
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
    this.showLoading("Recuperando");
    await this.svc.apiRest("POST", `recuperarUsuario&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        try{this.loading.dismiss();}catch(ex){}
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
    this.showLoading("Reseando");
    await this.svc.apiRest("POST", `resetearclave&id=${id}`, {id}).subscribe({
      next: (resp)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        try{this.loading.dismiss();}catch(ex){}
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }


  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

}
