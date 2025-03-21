import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movs',
  templateUrl: './movs.page.html',
  styleUrls: ['./movs.page.scss'],
  standalone: false
})
export class MovsPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);
  public readonly loadingCtrl = inject(LoadingController);
  
  public title: string = "Movimientos";
  
  public user: any = {};
  public lstMovs: any = {};
  public lstMovsOriginal: any = {};
  public buscar: string ="";
  public userID: number = 0;
  public MovsID: number = 0;
  public scope: Array<any>=[];
  public loading: any;

  public scopeR:boolean=false;
  public scopeW:boolean=false;
  public scopeD:boolean=false;

  public segment:string = "dia";

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.lstMovs = [];
    this.lstMovsOriginal = [];
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

    setTimeout(()=>{
      this.getData(true);
    },800)
  }

  pagination(startIndex=0, endIndex=10){
    this.lstMovs = this.lstMovsOriginal.slice(startIndex, endIndex);
  }


  getData = async (load:boolean = false) => {
    if (load) this.showLoading("Espere un momento");

    let params = {};

    switch(this.segment){
      case "dia":
        params = {
          fecha_ini: moment().format("Y-M-D"),
          fecha_fin: moment().format("Y-M-D"),
        }
        break;
      case "mes":
        params = {
          fecha_ini: moment().format("Y-M-") + "1",
          fecha_fin: moment().format("Y-M-D"),
        }
        break;
      case "trim":
        params = {
          fecha_ini: moment().format("Y-") + ((parseInt(moment().format("M")) - 2)>0 ? (parseInt(moment().format("M")) - 2) : '1') + "-" + 1,
          fecha_fin: moment().format("Y-M-D"),
        }
        break;
      case "anio":
        params = {
          // fecha_ini: moment().format("Y-") + "1-1",
          fecha_ini: "2024-1-1",
          fecha_fin: moment().format("Y-M-D"),
        }
        break;
    }
    this.svc.apiRest("POST", "transaccionesFiltro", params).subscribe({
      next: (resp:any)=>{
        this.loading.dismiss();
        if (resp.status == "ok"){
          this.lstMovsOriginal = resp.message;

          this.pagination();
          setTimeout(()=>{
            this.pagination(0,this.lstMovsOriginal.length)
          },1000)
        }else{
          this.svc.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
        this.loading.dismiss();
        this.svc.showAlert(error, "", "error", [{text: 'Aceptar',role: 'cancel',data: {action: 'cancel',},},]);
      }
    });
  }

  find = (event:any) => {
    if (this.buscar==""){
      this.lstMovs = Array.from(this.lstMovsOriginal);
    }else{
      this.lstMovs = [];
      this.lstMovsOriginal.forEach((e:any)=>{
        if (
          e.beneficiary_name.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.numberdocument.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.type.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.total.toString().toLowerCase().indexOf(this.buscar.toLowerCase())>-1 
        ){
          this.lstMovs.push(e)
        }
      })
    }

  }

  new(){
    // console.log("new");
    this.MovsID = -1;
    this.svc.goRoute(`/mov/${this.MovsID}`)
  }
  edit(id:any){
    // console.log("edit");
    this.MovsID = parseInt(id);
    this.svc.goRoute(`/mov/${this.MovsID}`)
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
    this.showLoading("Eliminando, espere un momento");
    await this.svc.apiRest("POST", "anularTransaction", id).subscribe({
      next: (resp)=>{
        this.loading.dismiss();
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        this.loading.dismiss();
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
  
  recovery = async (id:string) => {
    this.showLoading("Recuperando, espere un momento");
    await this.svc.apiRest("POST", `recuperarMovsucto&id=${id}`, null).subscribe({
      next: (resp)=>{
        this.loading.dismiss();
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error)=>{
        this.loading.dismiss();
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  async showLoading(texto: string = "Espere un momento", time: number = 0) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

}
