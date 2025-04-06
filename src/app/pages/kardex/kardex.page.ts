import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.page.html',
  styleUrls: ['./kardex.page.scss'],
  standalone: false
})
export class KardexPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);
  public readonly loadingCtrl = inject(LoadingController);

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

  public rstProd:any;
  public lstProd:Array<any> = [];
  public lstProdOriginal:Array<any> = [];
  public lstKardex:Array<any> = [];
  public lstKardexOriginal:Array<any> = [];

  public showProducts: boolean = true;
  public showProductsCost: boolean = false;
  public showProductsStock: boolean = false;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
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
      this.getProductos();
    },800)
  }

  pagination(what=0,startIndex=0, endIndex=10){
    if (what == 0){
      this.lstProd = this.lstProdOriginal.slice(startIndex, endIndex);
    }else{
      this.lstKardex = this.lstKardexOriginal.slice(startIndex, endIndex);
    }
  }

  getProductos = async (load:boolean = false) => {
    this.showLoading("Espere un momento");
    this.svc.apiRest("GET", "productos", null).subscribe({
      next: (resp:any)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status == "ok"){
          resp.message.forEach((e:any)=>{
            if (!e.deleted_at){
              this.lstProdOriginal.push(e)
            }
          })

          this.pagination();
          setTimeout(()=>{
            this.pagination(0,0,this.lstProdOriginal.length)
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


  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

  kardex = async (id:any, via=0) => {

    this.lstProd.forEach((e:any)=>{
      if (e.idproduct == id){
        this.rstProd = e;
      }
    });


    this.showProducts = false;

    if (via == 0){
      this.showProductsStock = true;
      this.showProductsCost = false;
    } else{
      this.showProductsCost = true;
      this.showProductsStock = false;
    }

    this.showLoading("Espere un momento");
    this.svc.apiRest("POST", `kardex&id=${id}`, null).subscribe({
      next: (resp:any)=>{
        try{this.loading.dismiss();}catch(ex){}

        // console.log(resp)
        if (resp.status == "ok"){
          resp.message.forEach((e:any)=>{
            if (!e.deleted_at){
              this.lstKardexOriginal.push(e)
            }
          })

          this.pagination(1);
          setTimeout(()=>{
            this.pagination(1, 0,this.lstKardexOriginal.length)
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


  retornar(){
    this.showProducts = true;
    this.showProductsStock = false;
    this.showProductsCost = false;
    this.lstKardexOriginal = [];
    this.lstKardex = [];
  }



}
