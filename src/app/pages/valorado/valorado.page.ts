import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-valorado',
  templateUrl: './valorado.page.html',
  styleUrls: ['./valorado.page.scss'],
  standalone: false
})
export class ValoradoPage implements OnInit {
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
  public lstCategoria:Array<any> = [];
  public lstLinea:Array<any> = [];

  public acumcosto:number = 0;
  public acumventa:number = 0;
  
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

  // pagination(startIndex=0, endIndex=10){
  //   this.lstProd = this.lstProdOriginal.slice(startIndex, endIndex);
  // }

  getProductos = async (load:boolean = false) => {
    this.showLoading("Espere un momento");
    this.svc.apiRest("GET", "productos", null).subscribe({
      next: (resp:any)=>{
        try{this.loading.dismiss();}catch(ex){}
        if (resp.status == "ok"){
          resp.message.forEach((e:any)=>{
            if (!e.deleted_at && e.status==1){
              this.lstProdOriginal.push(e)
            }
          })

          this.makeNumers();

          // this.pagination();
          // setTimeout(()=>{
          //   this.pagination(0,this.lstProdOriginal.length)
          // },1000)
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

  makeNumers(){
    let totalcosto = 0;
    let totalventa = 0;
    this.acumcosto = 0;
    this.acumventa = 0;
    this.lstCategoria = [];
    this.lstLinea= [];
    let found=false;
    this.lstProdOriginal.forEach( (e:any) => {
      e["idproduct"] = e.idproduct.toString();

      totalcosto = parseFloat(e.cost) * parseFloat(e.stock);
      totalventa = parseFloat(e.price) * parseFloat(e.stock);

      this.acumcosto += totalcosto;
      this.acumventa += totalventa;
      
      e["totalcost"] = totalcosto;
      e["totalprice"] = totalventa;

      /**CATEGORIA */
      found = false;
      this.lstCategoria.forEach((c:any)=>{
          if (!found && e.category == c.category){
              c.totalcost += totalcosto;
              c.totalventa += totalventa;
              found = true
          }
      });
      if (!found){
          this.lstCategoria.push({
              category: e.category, 
              totalcost: totalcosto,
              totalventa: totalventa
          });
      }

      /**LINEA*/

      found = false
      this.lstLinea.forEach( (c:any)=>{
          if (!found && e.line == c.line){
              found = true;
              c.totalcost += totalcosto;
              c.totalventa += totalventa;
          }
      });
      if (!found){
        this.lstLinea.push({
              line: e.line, 
              totalcost: totalcosto,
              totalventa: totalventa
          });
      }

      this.lstProd.push(e);
    });

  }


  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }
}
