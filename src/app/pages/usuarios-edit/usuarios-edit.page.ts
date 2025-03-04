import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.page.html',
  styleUrls: ['./usuarios-edit.page.scss'],
  standalone:false
})
export class UsuariosEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(GeneralService)
  private readonly sess = inject(Sessions)
  private readonly loadingCtrl = inject(LoadingController)
  private readonly menuSvc = inject(MenuService);

  public Titulo: string ="Usuario - Edición";

  public logged:boolean = false;
  public user:any;
  public rstUser:any = {};
  public userID:any;
  public username:string = "";
  public fullname:string = "";
  public idrole:string = "0";
  public lang:string = "es";
  public status:boolean = false;
  public error_clave:boolean= false;
  public scope:any= [];
  public lstRoles:Array<any>= [];
  public scopeR: boolean=false;
  public scopeW: boolean=false;
  public scopeD: boolean=false;
  public grant_movil_access: boolean=false;

  constructor() { }

  ngOnInit() {
    console.log("ngOnInit");
  }

  ngAfterContentInit(): void {
    // console.log("ngAfterContentInit");
    setTimeout(()=>{
      this.initial()
    },500)
  }

  ngOnDestroy(): void {
    this.user = -1;
    this.rstUser = {};
    this.userID = 0;
    this.username = "";
    this.fullname = "";
    this.idrole = "";
    this.status = false;
    this.scope = "";
    this.lstRoles = [];
    this.scopeR = false;
    this.scopeW = false;
    this.scopeD = false;
    this.grant_movil_access = false;
  }

  initial(){
    this.userID = this.route.snapshot.paramMap.get("id")?.toString();
    
    this.logged  = this.sess.get("logged");

    if (!this.logged){
      this.sess.clear();
      this.svc.goRoute("login");
    }

    this.user  = this.sess.get("user");
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);
    
    this.scope = this.user.role[0].scope.split("");
    if (this.scope.includes("R")) this.scopeR = true;
    if (this.scope.includes("W")) this.scopeW = true;
    if (this.scope.includes("D")) this.scopeD = true;

    if (!this.scopeR){
      this.svc.showToast("error", "Su rol asignado no le permite visualizar esta información.");
      this.back();
      return;
    }

    if (!this.scopeW){
      this.svc.showToast("error", "Su rol asignado no le permite realizar escritura.")
      this.back();
      return;
    }

    this.getRoles();
    setTimeout(()=>{
      this.svc.showLoading("Espere un momento", 1000);
      this.getData();
    },800)
  }

  getData = async (load:boolean=false) => {
    if (load) this.svc.showLoading("Espere un momento", 800);
    await this.svc.apiRest("GET", `user`, this.userID).subscribe({
      next: (resp)=>{
        // console.log(resp)
        if (resp.status == "ok"){
          this.rstUser = resp.message[0] ?? {};
          this.username = this.rstUser.username;
          this.fullname = this.rstUser.fullname;
          this.idrole = this.rstUser.idrole.toString();
          this.status = this.rstUser.status == 1 ? true : false ;
          this.grant_movil_access = this.rstUser.grant_movil_access == 1 ? true : false;
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

  getRoles = async () => {
    await this.svc.apiRest("GET", `roles`,null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          resp.message.forEach((e:any) => {
            if (e.status !=0 && e.name.indexOf("app")==-1){
              this.lstRoles.push(e);
            }
          });
          if (this.userID==-1) {
            this.idrole = this.lstRoles[0].idrole.toString();
          }
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

  save = async () => {
    let error = false;
    let msgError = "";

    
    if (!error && this.fullname == ''){
      error = true;
      msgError = "Debe llenar el nombre completo del usuario";
    }

    if (!error && this.username == ''){
      error = true;
      msgError = "El nombre del usuario no puede estar en blanco";
    }

    if (!error && this.idrole == ""){
      error = true;
      msgError = "Debe seleccionar un rol para el usuario";
    }

    if (error){
      this.error_clave = true;
      // this.svc.showToast("error", msgError);
      this.svc.showAlert("Edición de Usuarios",msgError, "error");
      return;
    }

    let data = {
      username: this.username.toLowerCase(),
      fullname: this.fullname,
      idrole: parseInt(this.idrole),
      status: this.status ? 1 : 0,
      grant_movil_access: this.grant_movil_access ? 1 : 0
    }

    let method = "PUT";
    let url = `saveUser&id=${this.userID}`;
    if (this.userID == -1){
      method = "POST";
      url = "saveUser";
    }

    await this.svc.apiRest(method, url, data).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.svc.showToast("info", "Usuario creado con éxito")
          this.back()
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

  back(){
    this.svc.goRoute("users")
  }

  async showLoading(texto: string, time:number = 0){
    let loading = await this.loadingCtrl.create({
      message: texto,
      duration: time,
      translucent: true,
      animated: true
    })
    loading.present();
  }

}
