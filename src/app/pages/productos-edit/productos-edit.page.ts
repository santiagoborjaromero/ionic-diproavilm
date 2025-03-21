import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-productos-edit',
  templateUrl: './productos-edit.page.html',
  styleUrls: ['./productos-edit.page.scss'],
  standalone:false
})
export class ProductosEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(GeneralService)
  private readonly sess = inject(Sessions)
  private readonly loadingCtrl = inject(LoadingController)
  private readonly menuSvc = inject(MenuService);

  /** Obligatorio o comun para todos los formularios */  
  public Titulo: string = "Productos - ";
  public logged:boolean = false;
  public user:any;
  public rstBene:any = {};
  public error_clave:boolean= false;
  public scope:any= [];
  public scopeR: boolean=false;
  public scopeW: boolean=false;
  public scopeD: boolean=false;
  
  /** Propio de cada formulario */
  public prodID:any;
  public rstProd: any = {};
  public idpresentation: string = "";
  public idproductline: string = "";
  public idproductcategory: string = "";
  public productcode: string = "";
  public barcode: string = "";
  public name: string = "";
  public description: string = "";
  // public cost: number = 0;
  // public stock: number = 0;
  public price: number = 0;
  // public stock_min: number = 0;
  // public stock_max: number = 0;
  // public image: string = "";
  public status: number = 0;
  public accountcost: string = "";
  public accountsales: string = "";
  public accountinv: string = "";

  public lstPresentation: Array<any> = [];
  public lstCategory: Array<any> = [];
  public lstLines: Array<any> = [];
  
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    setTimeout(()=>{
      this.initial()
    },500)
  }

  initial(){
    /**  TODO: OBLIGATORIO  */
    this.user  = this.sess.get("user");
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);

    /**  TODO: VERIFICACION DE PERMISOS DE LECTURA Y ESCRITURA */
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

    /** TODO: Verificacion de id proveniente de formulario padre */

    let id:any = this.route.snapshot.paramMap.get("id")?.toString();
    this.prodID = parseInt(id);
    if (this.prodID == "-1"){
      this.Titulo += "Nuevo";
    }else{
      this.Titulo += "Edición";
    }
    
    this.logged  = this.sess.get("logged");

    if (!this.logged){
      this.sess.clear();
      this.svc.goRoute("login");
    }

    this.getPresentation();
    this.getCategory();
    this.getlines();

    if (this.prodID != -1){
      setTimeout(()=>{
        this.svc.showLoading("Espere un momento", 1000);
        this.getData();
      },800)
    }
  }

  getData = async (load:boolean = false) => {
    if (load) this.svc.showLoading("Espere un momento", 800);
    await this.svc.apiRest("GET", `producto`, this.prodID).subscribe({
      next: (resp)=>{
        
        if (resp.status == "ok"){
          this.rstProd = resp.message[0] ?? {};

          this.idpresentation = this.rstProd.idpresentation.toString();
          this.idproductline = this.rstProd.idproductline.toString();
          this.idproductcategory = this.rstProd.idproductcategory.toString();
          this.productcode = this.rstProd.productcode;
          this.barcode = this.rstProd.barcode;
          this.name = this.rstProd.name;
          this.description = this.rstProd.description;
          this.price = this.rstProd.price;
          this.status = this.rstProd.status;
          this.accountcost = this.rstProd.accountcost;
          this.accountsales = this.rstProd.accountsales;
          this.accountinv = this.rstProd.accountinv;
          
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

  getPresentation = async () => {
    await this.svc.apiRest("GET", `presentacion`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstPresentation = resp.message;
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

  getCategory = async () => {
    await this.svc.apiRest("GET", `productoCategorias`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstCategory = resp.message;
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
  getlines = async () => {
    await this.svc.apiRest("GET", `productoLineas`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstLines = resp.message;
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

    if (!error && this.name == ''){
      error = true;
      msgError = "Debe ingresar el nombre  del producto";
    }
    if (!error && this.description == ''){
      error = true;
      msgError = "Debe seleccionar la descripcion del producto";
    }
    if (!error && this.productcode == ''){
      error = true;
      msgError = "Debe ingresar el codigo del producto";
    }
    if (!error && this.barcode == ''){
      error = true;
      msgError = "Debe ingresar el codigo de barras";
    }
    if (!error && this.idpresentation == ''){
      error = true;
      msgError = "Debe seleccionar la presentacion";
    }
    if (!error && this.idproductline == ''){
      error = true;
      msgError = "Debe seleccionar la linea del producto";
    }
    if (!error && this.idproductcategory == ''){
      error = true;
      msgError = "Deben ingresar el nombre de la categoria del producto";
    }
    if (!error && this.price <= 0 ){
      error = true;
      msgError = "Deben ingresar el valor PVP del producto";
    }

    if (error){
      this.error_clave = true;
      this.svc.showAlert(this.Titulo, msgError, "error");
      return;
    }
    
    let data = {
      idpresentation : this.idpresentation,
      idproductline : this.idproductline,
      idproductcategory : this.idproductcategory,
      productcode : this.productcode,
      barcode : this.barcode,
      name : this.name,
      description : this.description,
      price : this.price,
      status : this.status,
      accountcost : this.accountcost,
      accountsales : this.accountsales,
      accountinv : this.accountinv
    }

    let method = "PUT";
    let url = `saveProducto&id=${this.prodID}`;
    if (this.prodID == -1){
      method = "POST";
      url = "saveProducto";
    }

    await this.svc.apiRest(method, url, data).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.svc.showToast("info", `Beneficiario guardado con éxito`)
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
    this.svc.goRoute("productos")
  }

}
