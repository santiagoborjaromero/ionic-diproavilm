import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonSegmentView, LoadingController, ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-movs-edit',
  templateUrl: './movs-edit.page.html',
  styleUrls: ['./movs-edit.page.scss'],
  standalone: false
})
export class MovsEditPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  // @ViewChild(IonSegmentView) content!: IonSegmentView;

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);
  public readonly loadingCtrl = inject(LoadingController);
  public readonly modalCtrl = inject(ModalController);
  private readonly route = inject(ActivatedRoute);

  public title: string = "Movimientos";
  public user:any;

  public logged:boolean = false;
  public scope: Array<any> = [];
  public loading: any;

  public scopeR: boolean = false;
  public scopeW: boolean = false;
  public scopeD: boolean = false;

  public fecha: string = moment().format("Y-MM-DD");
  public sequential: number = 0;
  public idbeneficiary: number = -1;
  public beneficiario_nombre: string = "";
  public idproduct: number = 0;
  public idtransaction: any;
  public idmovementtype: any;
  public prefix: string = "003-001-";
  public numero_documento: string = "";
  public acronym: string = "FV";

  public buscar: string = "";
  public buscarBene: string = "";

  public codigo: string = "";
  public numdocreadonly: boolean = true;
  public showBeneficiarios: boolean = false;

  public rstTransaccion: any = {};
  public rstComprobante: any = {};
  public lstComprobantes: Array<any> = [];
  public lstBeneficiarios: Array<any> = [];
  public lstBeneficiariosFiltradoOriginal: Array<any> = [];
  public lstBeneficiariosFiltrado: Array<any> = [];
  public lstProductos: Array<any> = [];
  public lstProductosFiltradoOriginal: Array<any> = [];
  public lstProductosFiltrado: Array<any> = [];
  public lstCart: Array<any> = [];
  public rstTotal: any = {};

  constructor() { }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.loading = null;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initial();
    }, 800)
  }
  
  initial(){
    this.idtransaction = this.route.snapshot.paramMap.get("id")?.toString();
    
    if (this.idtransaction == "-1"){
      this.title = "Nuevo Movimiento";
    }else{
      this.title = "Edición de Movimiento";
    }
    
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
    
    this.getProducto();
    this.getMovTypes();
    this.getBene();
  
    if (this.idtransaction != "-1"){
      setTimeout(() => {
        this.getData();
      }, 800)
    }
  }
  
  getData = async () => { 
    // this.showLoading("Espere un momento");
    // console.log(this.idtransaction)
    await this.svc.apiRest("GET", "transaccionOne", this.idtransaction).subscribe({
      next: (resp) => {
        // this.loading.dismiss();
        // console.log(resp)
        if (resp.status == "ok") {
          // this.rstTransaccion = resp.message[0];
          this.rstTransaccion = resp.message;
          this.populateData();
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        this.loading.dismiss();
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  populateData = () => {
    this.idtransaction = this.rstTransaccion.idtransaction;
    this.idmovementtype = this.rstTransaccion.idmovementtype;
    this.fecha = moment(this.rstTransaccion.date).format("YYYY-MM-DD");
    this.numero_documento = this.rstTransaccion.numberdocument;
    this.idbeneficiary  = this.rstTransaccion.idbeneficiary;
    
    this.beneficiario_nombre = "";

    this.lstBeneficiarios.forEach((e: any) => {
      if (e.idbeneficiary == this.idbeneficiary) {
        this.beneficiario_nombre = `
          ${e.identification} <br><br>
          ${e.nombre} <br>
          ${e.nombrecomercial} <br>
          ${e.direccion} <br>
          ${e.telefono} <br>
          ${e.email} <br>
          ${e.pais} - ${e.provincia} - ${e.ciudad} <br>
        `;
      }
    });

    // console.log(this.idbeneficiary)

    this.lstCart = [];
    this.rstTransaccion.items.forEach( (e:any) => {
      this.lstCart.push({
        idproduct: e.idproducto,
        barcode: e.codigobarras,
        name: e.nombre,
        entry:  e.asiento,
        qty:  parseFloat(e.cantidad),
        price:  parseFloat(e.precio),
        total:  parseFloat(e.total)
      });
    });
    
  }

  getMovTypes = async () => {
    await this.svc.apiRest("GET", "movtipos", null).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          this.lstComprobantes = resp.message;
          // console.log(this.lstComprobantes)
          this.checkSecuencial();
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })

  }

  getBene = async () => {
    await this.svc.apiRest("GET", "bene", null).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          // this.lstBeneficiarios = [];
          resp.message.forEach((e: any) => {
            if (!e.deleted_at) {
              this.lstBeneficiarios.push(e)
              if (e.type == "C" || e.type == "A") {
                this.lstBeneficiariosFiltradoOriginal.push(e);
                this.lstBeneficiariosFiltrado.push(e);
              }
            }
          });
          // this.lstBeneficiarios = resp.message;
          this.lstBeneficiarios.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre));
          // console.log(this.lstBeneficiarios)
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  getProducto = async () => {
    await this.svc.apiRest("GET", "productos", null).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          resp.message.forEach((e: any) => {
            if (!e.deleted_at && e.stock > 0) {
              this.lstProductos.push(e);
            }
          });
          this.lstProductos.sort((a: any, b: any) => a.name.localeCompare(b.name));
          this.lstProductosFiltradoOriginal = Array.from(this.lstProductos);
          this.lstProductosFiltrado = Array.from(this.lstProductos);
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  setNumeroDocumento(numero: any) {
    return this.prefix + (numero + 1).toString().padStart(9, "0");
  }

  addProduct = (id: any, operador: string) => {

    let found = false;
    let index = 0;
    let obj: any;

    this.lstCart.forEach((e: any, idx: any) => {
      if (e.idproduct == id) {
        found = true;
        index = idx;
      }
    });

    if (found) {
      this.lstCart[index].qty += 1;
    } else {
      this.lstProductos.forEach((e: any, idx: any) => {
        if (e.idproduct == id) {
          obj = e
        }
      });
      this.lstCart.push(obj);
      this.lstCart[this.lstCart.length - 1]["qty"] = 1;
      this.lstCart[this.lstCart.length - 1]["entry"] = this.rstComprobante.entry == "A" ? "I" : this.rstComprobante.entry;
    }


    this.svc.showToast("light", "Producto añadido", 500, "top")
  }

  removeProduct = (id: any) => {
    this.lstCart.forEach((e: any, idx: any) => {
      if (e.idproduct == id) {
        this.lstCart.splice(idx, 1);

      }
    });
    this.svc.showToast("danger", "Producto removido", 500, "top")
  }


  calculoNumComp = (event: any) => {
    this.checkSecuencial();
  }

  checkSecuencial() {
    this.lstComprobantes.forEach((e: any) => {
      if (e.acronym == this.acronym) {
        this.rstComprobante = e;
      }
    });

    //console.log(this.rstComprobante)

    if (this.rstComprobante.calculatenumdoc == 1) {
      this.numero_documento = this.setNumeroDocumento(this.rstComprobante.sequential);
      this.numdocreadonly = true;
    } else {
      this.numero_documento = "";
      this.numdocreadonly = false;
    }

    this.lstBeneficiariosFiltradoOriginal = [];
    this.lstBeneficiariosFiltrado = [];

    this.lstBeneficiarios.forEach((e: any) => {
      if (e.type == this.rstComprobante.beneficiarytype || e.type == "A") {
        this.lstBeneficiariosFiltradoOriginal.push(e);
        this.lstBeneficiariosFiltrado.push(e);
      }
    });

    this.lstCart = [];
  }

  activarBuscarBeneficiario() {
    this.showBeneficiarios = !this.showBeneficiarios;
  }

  seleccionarBeneficiario(id: any) {
    this.idbeneficiary = id;

    this.lstBeneficiarios.forEach((e: any) => {
      if (e.idbeneficiary == id) {
        this.beneficiario_nombre = `
          ${e.identification} <br><br>
          ${e.nombre} <br>
          ${e.nombrecomercial} <br>
          ${e.direccion} <br>
          ${e.telefono} <br>
          ${e.email} <br>
          ${e.pais} - ${e.provincia} - ${e.ciudad} <br>
        `;
      }
    });

    this.activarBuscarBeneficiario();
    this.content.scrollToTop(500);
  }

  findBeneficiario(event: any) {
    if (this.buscarBene == "") {
      this.lstBeneficiariosFiltrado = Array.from(this.lstBeneficiariosFiltradoOriginal);
    } else {
      this.lstBeneficiariosFiltrado = [];
      this.lstBeneficiariosFiltradoOriginal.forEach((e: any) => {
        if (
          e.nombre.toLowerCase().indexOf(this.buscarBene.toLowerCase()) > -1 ||
          e.nombrecomercial.toLowerCase().indexOf(this.buscarBene.toLowerCase()) > -1 ||
          e.ciudad.toLowerCase().indexOf(this.buscarBene.toLowerCase()) > -1 ||
          e.identification.toLowerCase().indexOf(this.buscarBene.toLowerCase()) > -1
        ) {
          this.lstBeneficiariosFiltrado.push(e)
        }
      })
    }
  }

  findProducto(event: any) {
    if (this.buscar == "") {
      this.lstProductosFiltrado = Array.from(this.lstProductosFiltradoOriginal);
    } else {
      this.lstProductosFiltrado = [];
      this.lstProductosFiltradoOriginal.forEach((e: any) => {
        if (
          e.name.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.description.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.productcode.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.barcode.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.stock.toString().toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.price.toString().toLowerCase().indexOf(this.buscar.toLowerCase()) > -1
        ) {
          this.lstProductosFiltrado.push(e)
        }
      })
    }
  }

  totales(){
    let total_ing = 0;
    let count_ing = 0;
    let count_egr = 0;
    let total_egr = 0;

    this.lstCart.forEach((e:any)=>{
      if (e.entry == "I"){
        count_ing ++;
        total_ing += e.qty * e.price; 
      }else{
        count_egr ++;
        total_egr += e.qty * e.price; 
      }
    })

    this.rstTotal.items_ing = count_ing;
    this.rstTotal.total_ing = total_ing;
    this.rstTotal.items_egr = count_egr;
    this.rstTotal.total_egr = total_egr;
  }

  save = async () => {
    let errMsg = "";
    let error = false;

    if (!error && this.idbeneficiary == -1){
      errMsg = "Debe seleccionar un beneficiario";
      error = true;
    } 

    if (!error && this.numero_documento == ""){
      errMsg = "Debe ingresar un numero de documento válido";
      error = true;
    } 

    if (!error && this.fecha == ""){
      errMsg = "Debe ingresar una fecha válida";
      error = true;
    } 

    if (error){
      this.svc.showAlert(errMsg, "", "error", [{text: 'Aceptar',role: 'cancel',data: {action: 'cancel',},},]);
      return;
    }

    let method = "PUT";
    let url = `saveTransaction&id=${this.idtransaction}`;
    if (this.idtransaction == "-1"){
      method = "POST";
    }

    this.lstComprobantes.forEach((e:any)=>{
      if (e.acronym == this.acronym){
        this.idmovementtype = e.idmovementtype;
      }
    });

    let lstSave:any = [];
    let subtotal = 0;
    this.lstCart.forEach((e:any)=>{
      let tt = (e.qty * parseFloat(e.price));
      lstSave.push({
        idproduct: e.idproduct,
        entry: e.entry,
        qty: e.qty,
        price: parseFloat(e.price),
        total: tt
      })
      subtotal += tt;
    })

    let frmData = {
      idbeneficiary: parseInt(this.idbeneficiary.toString()),
      idmovementtype: this.idmovementtype,
      date: this.fecha,
      numberdocument: this.numero_documento,
      subtotal: subtotal,
      discount: 0,
      total: subtotal,
      reference: '',
      items: lstSave
    };

    await this.svc.apiRest(method, url, frmData).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
            this.back();
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })


  }

  back(){
    this.svc.goRoute("movimientos");
  }

  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params:any = await this.svc.showLoading(texto,time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

  baja(){
    this.content.scrollToBottom(500);
  }


}
