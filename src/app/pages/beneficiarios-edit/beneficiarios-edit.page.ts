import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { verificarCedula, verificarRuc } from 'udv-ec';



@Component({
  selector: 'app-beneficiarios-edit',
  templateUrl: './beneficiarios-edit.page.html',
  styleUrls: ['./beneficiarios-edit.page.scss'],
  standalone: false
})
export class BeneficiariosEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly svc = inject(GeneralService)
  private readonly sess = inject(Sessions)
  private readonly loadingCtrl = inject(LoadingController)
  private readonly menuSvc = inject(MenuService);

  public Titulo: string ="Beneficiario - ";

  public logged:boolean = false;
  public user:any;
  public rstBene:any = {};
  public beneID:any;
  public error_clave:boolean= false;
  public scope:any= [];
  public lstBene:Array<any>= [];
  public scopeR: boolean=false;
  public scopeW: boolean=false;
  public scopeD: boolean=false;

  /** Campos */
  public type:string = "C";
  public identificationtype:string = "2";
  public identificationnumber:string = "";
  public idcountry:string = "50";
  public idprovince:string = "19";
  public idcity:string = "177";
  public parish:string = "";
  public name:string = "";
  public comercialname:string = "";
  public address:string = "";
  public phone:string = "";
  public email:string = "";
  public web:string = "";
  public creditquota:number = 0;
  public creditdays:number = 0;
  public account:string = "";
  public validacion_cedula:string = "";

  public lstTypes: Array<any> = [];
  public lstIdentificationType: Array<any> = [];
  public lstCountry: Array<any> = [];
  public lstProvince: Array<any> = [];
  public lstCity: Array<any> = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    // console.log("ngAfterContentInit");
    setTimeout(()=>{
      this.initial()
    },500)
  }

  initial(){
    this.beneID = this.route.snapshot.paramMap.get("id")?.toString();
    if (this.beneID == "-1"){
      this.Titulo += "Nuevo";
    }else{
      this.Titulo += "Edición";
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

    this.lstTypes.push({id: "C", name: "Cliente"});
    this.lstTypes.push({id: "P", name: "Proveedor"});
    this.lstTypes.push({id: "A", name: "Cliente y Proveedor"});
    this.lstTypes.push({id: "E", name: "Diproavilm"});

    this.getIdentificationType();
    this.getCountry();
    this.getProvince();
    this.getCity();

    if (this.beneID != "-1"){
      setTimeout(()=>{
        this.svc.showLoading("Espere un momento", 1000);
        this.getData();
      },800)
    }
  }

  getData = async (load:boolean=false) => {
    if (load) this.svc.showLoading("Espere un momento", 800);
    await this.svc.apiRest("GET", `beneone`, this.beneID).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.rstBene = resp.message[0] ?? {};
          
          // console.log(this.rstBene)

          this.type = this.rstBene.type;
          this.identificationtype = this.rstBene.ididentificationtype;
          this.identificationnumber = this.rstBene.identification;
          this.idcountry = this.rstBene.idcountry.toString();
          this.idprovince = this.rstBene.idprovince.toString();
          this.idcity = this.rstBene.idcity.toString();
          this.parish = this.rstBene.parroquia;
          this.name = this.rstBene.nombre;
          this.comercialname = this.rstBene.nombrecomercial;
          this.address = this.rstBene.direccion;
          this.phone = this.rstBene.telefono;
          this.email = this.rstBene.email;
          this.web = this.rstBene.web;
          this.creditquota = this.rstBene.creditquota;
          this.creditdays = this.rstBene.creditdays;
          this.account = this.rstBene.account;
          
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

  getIdentificationType = async () => {
    await this.svc.apiRest("GET", `tipoIdentificacion`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstIdentificationType = resp.message;
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

  getCountry = async () => {
    await this.svc.apiRest("GET", `pais`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstCountry = resp.message;
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
  getProvince = async () => {
    await this.svc.apiRest("GET", `provincia`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstProvince = resp.message;
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
  getCity = async () => {
    await this.svc.apiRest("GET", `ciudad`, null).subscribe({
      next: (resp)=>{
        if (resp.status == "ok"){
          this.lstCity = resp.message;
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

    this.verifyCedula();

    if (!error && this.name == ''){
      error = true;
      msgError = "Deben ingresar el nombre del beneficiario";
    }
    if (!error && this.type == ''){
      error = true;
      msgError = "Debe seleccionar el tipo de beneficiario";
    }
    if (!error && this.identificationtype == ''){
      error = true;
      msgError = "Debe seleccionar el tipo de identificacion";
    }
    if (!error && this.identificationnumber == ''){
      error = true;
      msgError = "Debe ingresar el numero de identificación";
    }
    if (!error && !["Identificación verificada","Cédula Válida", "RUC Válido"].includes(this.validacion_cedula)){
      error = true;
      msgError = "Deben ingresar el numero de identificacion válido";
    }
    if (!error && this.idcountry == ''){
      error = true;
      msgError = "Debe seleccionar el País";
    }
    if (!error && this.idprovince == ''){
      error = true;
      msgError = "Debe seleccionar la Provincia";
    }
    if (!error && this.idcity == ''){
      error = true;
      msgError = "Debe seleccionar la Ciudad";
    }
    if (error){
      this.error_clave = true;
      this.svc.showAlert(this.Titulo , msgError, "error");
      return;
    }

    let data = {
      type: this.type,
      ididentificationtype: parseInt(this.identificationtype),
      identificationnumber: this.identificationnumber,
      idcountry: parseInt(this.idcountry),
      idprovince: parseInt(this.idprovince),
      idcity: parseInt(this.idcity),
      parish: this.parish,
      name: this.name,
      comercialname: this.comercialname,
      address: this.address,
      phone: this.phone,
      email: this.email,
      web: this.web,
      creditquota: this.creditquota,
      creditdays: this.creditdays,
      account: this.account,
    }

    let method = "PUT";
    let url = `saveBene&id=${this.beneID}`;
    if (this.beneID == -1){
      method = "POST";
      url = "saveBene";
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
    this.svc.goRoute("beneficiarios")
  }


  validarIdentificacion(){
    if (this.identificationtype == "2"){
      this.validacion_cedula = verificarCedula(this.identificationnumber) ? "Cédula Válida" : "Cédula Inválida";
    } if(this.identificationtype == "1"){
      this.validacion_cedula = verificarRuc(this.identificationnumber) ? "RUC Válido" : "RUC Inválido";
    }
  }

  verifyCedula = async () => {
    if (this.beneID==-1){
      if (["Cédula Válida", "RUC Válido"].includes(this.validacion_cedula)){
        await this.svc.apiRest("GET", "videntidad", this.identificationnumber).subscribe({
          next: (resp)=>{
            // console.log(resp)
            if (resp){
              this.validacion_cedula = resp.message;
            }
          },
          error: (error)=>{
            console.log("ERROR", error)
            this.svc.showAlert(this.Titulo , error, "error");
          }
        })
      }
    }
  }


}
