import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ChartConfiguration, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  // @ViewChild('lineCanvas') lineCanvas?: ElementRef;

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public  readonly func = inject(Functions);
  // private readonly chart = inject(Chart)


  public trimestres: any = {};
  public lstData: any = {};
  public user: any = {};
  public ctxIE: any;
  public ctxTIE: any;
  public ctxPolarTC: any;
  public ctxPolarCategoria: any;
  public ctxPolarLinea: any;
  public cgx: any;
  public lstDataVentasPorAnio: any = [];
  public tipoComprobantes: any = [];
  public CategoriaProd: any = [];
  public LineaProd: any = [];
  public Top5Prod: any = [];
  public Top5Prod_Limitado: any = [];
  public Top5Clie: any = [];
  public Top5Clie_Limitado: any = [];
  public Top5Ciu: any = [];
  public Top5Ciu_Limitado: any = [];
  public colores: any = [
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)',
    'rgba(201, 203, 207, 0.5)'
  ]
  public egresoStock: number = 0;
  public egresoTotal: number = 0;
  public porcStock: number = 0;
  public porcTotal: number = 0;
  public ventasStock: number = 0;
  public ventasTotal: number = 0;

  public lineChartDataCantidadIngresosPorAnio: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  }
  public lineChartOptionsCantidadIngresosPorAnio: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public lineChartDataCantidadVentasPorAnio: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  }
  public lineChartOptionsCantidadVentasPorAnio: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  public LCDataTipoComprobantes: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  }
  public LCOptionsTipoComprobantes: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    indexAxis: 'x',
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor() { }

  ngOnInit() {
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);

    this.getData();
  }

  getData = async () => {
    let params = {
      fecha_ini: "2024-01-01",
      // fecha_fin: moment().format("YYYY-MM-DD"),
      fecha_fin: "2024-12-31",
      app: "movil"
    }

    this.svc.apiRest("POST", "movgeneral", params).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.lstData = resp.message;
          this.graficar();
        } else {
          this.svc.showAlert("Dashboard", resp.message, "error")
        }
      },
      error: (err) => {
        console.log(err)
        this.svc.showAlert("Dashboard", err, "error")
      }
    })
  }

  graficar() {

    console.log("graficar")

    this.trimestres = {
      labels: ["Trim 1", "Trim 2", "Trim 3", "Trim 4"],
      data_egreso: [],
      data_ingreso: [],
      data_egreso_total: [],
      data_ingreso_total: [],
    }

    let trim1egr = 0;
    let trim1ing = 0;
    let trim2egr = 0;
    let trim2ing = 0;
    let trim3egr = 0;
    let trim3ing = 0;
    let trim4egr = 0;
    let trim4ing = 0;
    let trim1egrtot = 0;
    let trim1ingtot = 0;
    let trim2egrtot = 0;
    let trim2ingtot = 0;
    let trim3egrtot = 0;
    let trim3ingtot = 0;
    let trim4egrtot = 0;
    let trim4ingtot = 0;
    // let egresoStock = 0;
    // let egresoTotal = 0;
    // let ventasStock = 0;
    // let ventasTotal = 0;
    let found = false;



    this.lstData.forEach((d: any) => {

      /** TRIMESTRES  */
      trim1egr += d.trimestre == 1 && d.asiento == 'E' ? parseFloat(d.cantidad) : 0;
      trim2egr += d.trimestre == 2 && d.asiento == 'E' ? parseFloat(d.cantidad) : 0;
      trim3egr += d.trimestre == 3 && d.asiento == 'E' ? parseFloat(d.cantidad) : 0;
      trim4egr += d.trimestre == 4 && d.asiento == 'E' ? parseFloat(d.cantidad) : 0;

      trim1ing += d.trimestre == 1 && d.asiento == 'I' ? parseFloat(d.cantidad) : 0;
      trim2ing += d.trimestre == 2 && d.asiento == 'I' ? parseFloat(d.cantidad) : 0;
      trim3ing += d.trimestre == 3 && d.asiento == 'I' ? parseFloat(d.cantidad) : 0;
      trim4ing += d.trimestre == 4 && d.asiento == 'I' ? parseFloat(d.cantidad) : 0;

      trim1egrtot += d.trimestre == 1 && d.asiento == 'E' ? parseFloat(d.total) : 0;
      trim2egrtot += d.trimestre == 2 && d.asiento == 'E' ? parseFloat(d.total) : 0;
      trim3egrtot += d.trimestre == 3 && d.asiento == 'E' ? parseFloat(d.total) : 0;
      trim4egrtot += d.trimestre == 4 && d.asiento == 'E' ? parseFloat(d.total) : 0;

      trim1ingtot += d.trimestre == 1 && d.asiento == 'I' ? parseFloat(d.total) : 0;
      trim2ingtot += d.trimestre == 2 && d.asiento == 'I' ? parseFloat(d.total) : 0;
      trim3ingtot += d.trimestre == 3 && d.asiento == 'I' ? parseFloat(d.total) : 0;
      trim4ingtot += d.trimestre == 4 && d.asiento == 'I' ? parseFloat(d.total) : 0;

      /** TOTAL CANTIDAD Y VALOR POR VENTAS */
      this.ventasStock += d.coddoc == "FV" ? parseFloat(d.cantidad) : 0;
      this.ventasTotal += d.coddoc == "FV" ? parseFloat(d.total) : 0;

      /** TOTAL POR TIPO DE COMPROBANTES */

      found = false;
      this.tipoComprobantes.forEach((tc: any, idx: number) => {

        if (!found && tc.tipo == d.movimiento) {
          found = true;
          this.tipoComprobantes[idx].ingreso = tc.ingreso + (d.asiento == "I" ? parseFloat(d.total) : 0);
          this.tipoComprobantes[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        this.tipoComprobantes.push(
          {
            tipo: d.movimiento,
            ingreso: d.asiento == "I" ? parseFloat(d.total) : 0,
            egreso: d.asiento == "E" ? parseFloat(d.total) : 0
          }
        )
      }

      /** TOTAL POR CATEGORIAS */
      found = false;
      this.CategoriaProd.forEach((tc: any, idx: number) => {

        if (!found && tc.label == d.categoria) {
          found = true;
          this.CategoriaProd[idx].ingreso = tc.ingreso + (d.asiento == "I" ? parseFloat(d.total) : 0);
          this.CategoriaProd[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        this.CategoriaProd.push(
          {
            label: d.categoria,
            ingreso: d.asiento == "I" ? parseFloat(d.total) : 0,
            egreso: d.asiento == "E" ? parseFloat(d.total) : 0
          }
        )
      }

      /** TOTAL POR LINEA DE PRODUCTOS */
      found = false;
      this.LineaProd.forEach((tc: any, idx: number) => {

        if (!found && tc.label == d.linea) {
          found = true;
          this.LineaProd[idx].ingreso = tc.ingreso + (d.asiento == "I" ? parseFloat(d.total) : 0);
          this.LineaProd[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        this.LineaProd.push(
          {
            label: d.linea,
            ingreso: d.asiento == "I" ? parseFloat(d.total) : 0,
            egreso: d.asiento == "E" ? parseFloat(d.total) : 0
          }
        )
      }


      /** TOP 5 PRODUCTOS */
      found = false;
      this.Top5Prod.forEach((tc: any, idx: number) => {
        if (!found && tc.label == d.nombre) {
          found = true;
          this.Top5Prod[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        if (d.coddoc == "FV") {
          this.Top5Prod.push(
            {
              label: d.nombre,
              egreso: d.asiento == "E" ? parseFloat(d.total) : 0
            }
          )
        }
      }

      this.Top5Prod_Limitado = [];
      let count = 0
      this.Top5Prod.forEach((p:any)=>{
        count++;
        if (count<=5){
          this.Top5Prod_Limitado.push(p);
        }
      });


      /** TOP 5 CLIENTES */
      found = false;
      this.Top5Clie.forEach((tc: any, idx: number) => {
        if (!found && tc.label == d.beneficiario) {
          found = true;
          this.Top5Clie[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        if (d.asiento == "E") {
          this.Top5Clie.push(
            {
              label: d.beneficiario,
              egreso: d.asiento == "E" ? parseFloat(d.total) : 0
            }
          )
        }
      }

      this.Top5Clie_Limitado = [];
      count = 0
      this.Top5Clie.forEach((p:any)=>{
        count++;
        if (count<=5){
          this.Top5Clie_Limitado.push(p);
        }
      });

      /** TOP 5 CIUDADES */
      found = false;
      this.Top5Ciu.forEach((tc: any, idx: number) => {
        if (!found && tc.label == d.ciudad) {
          found = true;
          this.Top5Ciu[idx].egreso = tc.egreso + (d.asiento == "E" ? parseFloat(d.total) : 0);
        }
      })
      if (!found) {
        if (d.asiento == "E") {
          this.Top5Ciu.push(
            {
              label: d.ciudad,
              egreso: d.asiento == "E" ? parseFloat(d.total) : 0
            }
          )
        }
      }

      this.Top5Ciu_Limitado = [];
      count = 0
      this.Top5Ciu.forEach((p:any)=>{
        count++;
        if (count<=5){
          this.Top5Ciu_Limitado.push(p);
        }
      });


    });

    this.trimestres.data_ingreso = [trim1ing, trim2ing, trim3ing, trim4ing];
    this.trimestres.data_ingreso_total = [trim1ingtot, trim2ingtot, trim3ingtot, trim4ingtot];
    this.trimestres.data_egreso = [trim1egr, trim2egr, trim3egr, trim4egr];
    this.trimestres.data_egreso_total = [trim1egrtot, trim2egrtot, trim3egrtot, trim4egrtot];

    this.egresoStock = trim1ing + trim2ing + trim3ing + trim4ing;
    this.egresoTotal = trim1ingtot + trim2ingtot + trim3ingtot + trim4ingtot;

    this.porcStock = (this.ventasStock / this.egresoStock) * 100;
    this.porcTotal = (this.ventasTotal / this.egresoTotal) * 100;


    this.chartCantidadIngresoEgresos();
    this.chartCategorias();
  }


  chartCantidadIngresoEgresos() {
    console.log("chartCantidadIngresoEgresos");
    this.lineChartDataCantidadIngresosPorAnio = {
      labels: this.trimestres.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: this.trimestres.data_ingreso,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores[2]
        },
        {
          label: 'Egresos',
          data: this.trimestres.data_egreso,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores[1],

        }
      ]
    }
    this.lineChartDataCantidadVentasPorAnio = {
      labels: this.trimestres.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: this.trimestres.data_ingreso_total,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores[3]
        },
        {
          label: 'Egresos',
          data: this.trimestres.data_egreso_total,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores[4],

        }
      ]
    }
  }

  chartCategorias(){
    console.log("chartCategorias");

    /**TIPO DE COMPROBANTES */
    let grptipo:any = [];
    let grpIng:any = [];
    let grpEgr:any = [];
    let tblTCTotIng = 0;
    let tblTCTotEgr = 0;
    this.tipoComprobantes.forEach((tc:any)=>{
        grptipo.push(tc.tipo);
        grpIng.push(tc.ingreso);
        grpEgr.push(tc.egreso);
        tblTCTotIng += tc.ingreso;
        tblTCTotEgr += tc.egreso;
    })
  
      // $("#tblTCTotIng").html(numero(tblTCTotIng,2))
      // $("#tblTCTotEgr").html(numero(tblTCTotEgr,2))
      
    this.LCDataTipoComprobantes = {
      labels: grptipo,
      datasets: [
        {
          label: 'Ingresos',
          data: grpIng,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores
        },
        {
          label: 'Egresos',
          data: grpEgr,
          borderWidth: 0,
          tension: 0.1,
          borderColor: 'black',
          backgroundColor: this.colores
        }
      ]
    }
  }



}
