import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

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
  public rstMov: any = {};
  public lstMovsOriginal: any = {};
  public buscar: string = "";
  public userID: number = 0;
  public MovsID: number = 0;
  public scope: Array<any> = [];
  public loading: any;

  public scopeR: boolean = false;
  public scopeW: boolean = false;
  public scopeD: boolean = false;

  public segment: string = "dia";

  constructor() { }

  ngOnInit() { }

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

    if (!this.scopeR) {
      this.svc.showToast("error", "Su rol asignado no le permite visualizar esta información.")
      return;
    }

    setTimeout(() => {
      this.getData(true);
    }, 800)
  }

  pagination(startIndex = 0, endIndex = 10) {
    if (this.lstMovsOriginal.length > 0) {
      this.lstMovs = this.lstMovsOriginal.slice(startIndex, endIndex);
    } else {
      this.lstMovs = [];
    }
  }


  getData = async (load: boolean = false) => {
    if (load) this.showLoading("Espere un momento");

    let params = {};

    switch (this.segment) {
      case "dia":
        params = {
          fecha_ini: moment().format("YYYY-MM-DD"),
          fecha_fin: moment().format("YYYY-MM-DD"),
        }
        break;
      case "mes":
        params = {
          fecha_ini: moment().format("YYYY-MM-") + "01",
          fecha_fin: moment().format("YYYY-MM-DD"),
        }
        break;
      case "trim":
        params = {
          fecha_ini: moment().format("YYYY-") + ((parseInt(moment().format("M")) - 2) > 0 ? (parseInt(moment().format("M")) - 2) : '1') + "-0" + 1,
          fecha_fin: moment().format("YYYY-MM-DD"),
        }
        break;
      case "anio":
        params = {
          // fecha_ini: moment().format("Y-") + "1-1",
          fecha_ini: "2024-01-01",
          fecha_fin: moment().format("YYYY-MM-DD"),
        }
        break;
    }

    // console.log(params)

    this.lstMovsOriginal = [];
    this.lstMovs = [];
    this.svc.apiRest("POST", "transaccionesFiltro", params).subscribe({
      next: (resp: any) => {
        try { this.loading.dismiss(); } catch (ex) { }

        if (resp.status == "ok") {

          if (resp.message) {
            this.lstMovsOriginal = resp.message;
            this.pagination();
            setTimeout(() => {
              this.pagination(0, this.lstMovsOriginal.length)
            }, 1000)
          }

        } else {
          this.svc.showAlert(resp.message, "", "error", [{ text: 'Aceptar', role: 'cancel', data: { action: 'cancel', }, },]);
        }
      },
      error: (error: any) => {
        try { this.loading.dismiss(); } catch (ex) { }
        this.svc.showAlert(error, "", "error", [{ text: 'Aceptar', role: 'cancel', data: { action: 'cancel', }, },]);
      }
    });
  }

  find = (event: any) => {
    if (this.buscar == "") {
      this.lstMovs = Array.from(this.lstMovsOriginal);
    } else {
      this.lstMovs = [];
      this.lstMovsOriginal.forEach((e: any) => {
        if (
          e.beneficiary_name.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.numberdocument.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.type.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.date.toLowerCase().indexOf(this.buscar.toLowerCase()) > -1 ||
          e.total.toString().toLowerCase().indexOf(this.buscar.toLowerCase()) > -1
        ) {
          this.lstMovs.push(e)
        }
      })
    }
  }

  new() {
    // console.log("new");
    this.MovsID = -1;
    this.svc.goRoute(`/mov/${this.MovsID}`)
  }
  edit(id: any) {
    // console.log("edit");
    this.MovsID = parseInt(id);
    this.svc.goRoute(`/mov/${this.MovsID}`)
  }

  del = async (id: any) => {
    Swal.fire({
      title: this.title,
      text: `Desea anular la transacción?`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      heightAuto: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.eliminar(id);
      }
    });
  }

  eliminar = async (id: string) => {
    this.showLoading("Eliminando, espere un momento");
    await this.svc.apiRest("POST", "anularTransaction&id=" + id, null).subscribe({
      next: (resp) => {
        try { this.loading.dismiss(); } catch (ex) { }
        if (resp.status == "ok") {
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        try { this.loading.dismiss(); } catch (ex) { }
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  recuperar = async (id: any) => {
    Swal.fire({
      title: this.title,
      text: `Desea recuperar el registro?`,
      icon: 'question',
      confirmButtonText: 'Aceptar',
      heightAuto: false,
      showCancelButton: true,
      cancelButtonText: "Cancelar"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.recovery(id);
      }
    });
  }

  recovery = async (id: string) => {
    this.showLoading("Recuperando, espere un momento");
    await this.svc.apiRest("POST", `recuperarTransaccion&id=${id}`, null).subscribe({
      next: (resp) => {
        try { this.loading.dismiss(); } catch (ex) { }
        if (resp.status == "ok") {
          this.svc.showToast("info", resp.message)
          this.getData(true);
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        try { this.loading.dismiss(); } catch (ex) { }
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  async showLoading(texto: string = "Espere un momento", time: number = 2000) {
    let params: any = await this.svc.showLoading(texto, time);
    this.loading = await this.loadingCtrl.create(params)
    this.loading.present();
  }

  getMov = async (rst:any) => { 
    this.showLoading("Espere un momento",1000);
    await this.svc.apiRest("GET", "transaccionOne", rst.idtransaction).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          this.exportar(resp.message);
        } else {
          this.svc.showToast("error", resp.message)
        }
      },
      error: (error) => {
        try{this.loading.dismiss();}catch(ex){}
        console.log("ERROR", error)
        this.svc.showToast("error", error)
      }
    })
  }

  exportar(rst: any) {
    // console.log(rst)

    var doc = new jsPDF({
      orientation: "p",
      format: 'A4',
      unit: 'mm'
    })

    autoTable(doc, {
      body: [
        [
          {
            content: 'Movimientos de Almacén',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#FF0000'
            }
          },
        ],
        [
          {
            content: `\n\nFecha: ${rst.date}`
              + `\nBeneficiario: ${rst.beneficiary_name}`
              + `\nTipo de comprobante: ${rst.type}`
              + `\nNúmero de documento: ${rst.numberdocument}`
              + `\nEstado: ${rst.status == 0 ? 'Anulado' : 'Activo'}`
              + `\ntotal: ${this.func.numberFormat(rst.subtotal, 2)}`,
            styles: {
              halign: 'left'
            }
          },
        ],
      ],
      theme: 'plain',
    });


    let itm: Array<any> =[];
    if (rst.items){
      rst.items.forEach((e:any)=>{
        itm.push({
          Producto: e.nombre,
          Asiento: e.asiento == 'I' ? 'Ingreso' : 'Egreso',
          Cantidad: this.func.numberFormat(e.cantidad,2),
          Precio: this.func.numberFormat(e.precio,2),
          Total: this.func.numberFormat(e.total,2),
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
    }

    doc.save(`movimientos_${rst.numberdocument}.pdf`);

  }


  transformarDatosPDF(array: any = []) {

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
