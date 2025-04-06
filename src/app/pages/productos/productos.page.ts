import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);
  public readonly loadingCtrl = inject(LoadingController);
  
  public title: string = "Productos";
  
  public user: any = {};
  public lstProd: any = {};
  public lstProdOriginal: any = {};
  public buscar: string ="";
  public userID: number = 0;
  public prodID: number = 0;
  public scope: Array<any>=[];

  public scopeR:boolean=false;
  public scopeW:boolean=false;
  public scopeD:boolean=false;

  public loading:any;

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.lstProd = [];
    this.lstProdOriginal = [];
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
    this.lstProd = this.lstProdOriginal.slice(startIndex, endIndex);
  }


  getData = async (load:boolean = false) => {
    this.showLoading("Espere un momento");
    this.svc.apiRest("GET", "productos", null).subscribe({
      next: (resp:any)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status == "ok"){
          this.lstProdOriginal = resp.message;
          this.pagination();
          setTimeout(()=>{
            this.pagination(0,this.lstProdOriginal.length)
          },1000)
        }else{
          this.svc.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
        try{this.loading.dismiss();}catch(ex){}
        this.svc.showAlert(error, "", "error", [{text: 'Aceptar',role: 'cancel',data: {action: 'cancel',},},]);
      }
    });
  }

  find = (event:any) => {
    if (this.buscar==""){
      this.lstProd = Array.from(this.lstProdOriginal);
    }else{
      this.lstProd = [];
      this.lstProdOriginal.forEach((e:any)=>{
        if (
          e.name.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.description.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.presentation.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.productcode.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.barcode.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.line.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ||
          e.category.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 
        ){
          this.lstProd.push(e)
        }
      })
    }

  }

  new(){
    // console.log("new");
    this.prodID = -1;
    this.svc.goRoute(`/producto/${this.prodID}`)
  }
  edit(id:any){
    // console.log("edit");
    this.prodID = parseInt(id);
    this.svc.goRoute(`/producto/${this.prodID}`)
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
    await this.svc.apiRest("DELETE", "deleteProducto", id).subscribe({
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
    this.showLoading("Recuperando, espere un momento")
    await this.svc.apiRest("POST", `recuperarProducto&id=${id}`, null).subscribe({
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
