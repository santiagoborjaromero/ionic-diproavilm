import { Component, OnInit, inject } from '@angular/core';
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
  
  public title: string = "Productos";
  
  public user: any = {};
  public lstProd: any = {};
  public lstProdOriginal: any = {};
  public buscar: string ="";
  public userID: number = 0;
  public prodID: number = 0;
  public scope: Array<any>=[];

  public scopeR:boolean=false;;
  public scopeW:boolean=false;;
  public scopeD:boolean=false;;

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


  getData = async (load:boolean = false) => {
    if (load) this.svc.showLoading("Espere un momento", 1000);
    this.svc.apiRest("GET", "productos", null).subscribe({
      next: (resp:any)=>{

        if (resp.status == "ok"){
          this.lstProd = resp.message;
          this.lstProdOriginal = resp.message;
        }else{
          this.svc.showAlert(resp.message, "", "error", [{text: 'Aceptar',role: 'cancel',data: {  action: 'cancel',},},]);
        }
      },
      error: (error:any)=>{
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
    await this.svc.apiRest("DELETE", "deleteBene", id).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
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
    await this.svc.apiRest("PUT", `recuperaBene&id=${id}`, null).subscribe({
      next: (resp)=>{
        if (resp.status=="ok"){
          this.svc.showToast("info", resp.message)
          this.getData(true);
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

}
