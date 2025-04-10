import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

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

  exportar(que:number=1){
    var doc = new jsPDF({
      orientation: "p",
      format: 'A4',
      unit: 'mm'
    })

    autoTable(doc, {
      body: [
        [
          {
            content: 'Kardex de Productos',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#FF0000'
            }
          },
          {
            content: que == 1 ? `Por Stock` : 'Por Costo',
            styles: {
              halign: 'left',
              fontSize: 15,
            }
          }
        ],
        [
          {
            content: `\n\n${this.rstProd.productcode}`
            + `\n${this.rstProd.barcode}`
            + `\n${this.rstProd.name}`
            + `\nCosto: ${this.func.numberFormat(this.rstProd.cost,4)}`
            + `\nStock: ${this.func.numberFormat(this.rstProd.stock,4)}`,
            styles: {
              halign: 'left'
            }
          },
        ],
      ],
      theme: 'plain',
    });

    
    let itm: Array<any> =[];
    this.lstKardex.forEach((e:any)=>{
      itm.push({
        Fecha: e.fecha,
        Asiento: e.asiento,
        Ingreso: this.func.numberFormat(e.ing_costo,4),
        Egreso: this.func.numberFormat(e.egr_costo,4),
        Saldo: this.func.numberFormat(e.sal_costo,4),
      })
    })

    let records = this.transformarDatosPDF(itm);

    autoTable(doc, {
        head: [records[0]],
        body: records.slice(1),
        theme: 'striped',
        headStyles:{
          fillColor: '#dadada',
          textColor: '#000'
        },
        styles:{
          textColor: '#000'
        }
    });

    doc.save(`kardex_${this.rstProd.productcode}.pdf`);

  }


  transformarDatosPDF(array:any = []){

    const data = [];
    let cabecera = Object.keys(array[0]);
    data.push(cabecera);

    let temp = [];
    for (var i = 0; i < array.length; i++) {
        temp = [];
        for (var index in array[i]) {
            temp.push(array[i][index] == null ? '' : array[i][index]);
        }
        data.push(temp)
    }
    return data;
}


}
