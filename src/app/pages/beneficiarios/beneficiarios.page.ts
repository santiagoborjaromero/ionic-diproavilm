import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.page.html',
  styleUrls: ['./beneficiarios.page.scss'],
  standalone: false
})
export class BeneficiariosPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  private readonly loadingCtrl = inject(LoadingController);
  
  public title: string = "Beneficiarios";
  
  public user: any = {};
  public lstBene: any = {};
  public lstBeneOriginal: any = {};
  public buscar: string ="";
  public userID: number = 0;
  public beneID: number = 0;
  public scope: Array<any>=[];
  public loading: any;

  public scopeR:boolean=false;;
  public scopeW:boolean=false;;
  public scopeD:boolean=false;;

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.lstBene = [];
    this.lstBeneOriginal = [];
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

  pagination(startIndex=0, endIndex=10){
    this.lstBene = this.lstBeneOriginal.slice(startIndex, endIndex);
  }

  getData = async (load:boolean = false) => {
    this.showLoading("Espere un momento");
    this.svc.apiRest("GET", "bene", null).subscribe({
      next: (resp:any)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status == "ok"){
          this.lstBeneOriginal = resp.message;
          this.pagination();
          setTimeout(()=>{
            this.pagination(0,this.lstBeneOriginal.length)
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

  trackById(index: number, item: any): number {
    return item.id; // o el campo que sea único
  }

  find = (event:any) => {
    if (this.buscar==""){
      this.lstBene = Array.from(this.lstBeneOriginal);
    }else{
      this.lstBene = [];
      this.lstBeneOriginal.forEach((e:any)=>{
        if (
          e.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.nombrecomercial.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.identification.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 
        ){
          this.lstBene.push(e)
        }
      })
    }

  }

  new(){
    // console.log("new");
    this.beneID = -1;
    this.svc.goRoute(`/beneficiario/${this.beneID}`)
  }
  edit(id:any){
    // console.log("edit");
    this.beneID = parseInt(id);
    this.svc.goRoute(`/beneficiario/${this.beneID}`)
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
    this.showLoading("Eliminando");
    await this.svc.apiRest("DELETE", "deleteBene", id).subscribe({
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
    this.showLoading("Recuperando")
    await this.svc.apiRest("PUT", `recuperaBene&id=${id}`, null).subscribe({
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


  showLoading = async (texto: string = "Espere un momento", time: number = 2000) => {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

}
