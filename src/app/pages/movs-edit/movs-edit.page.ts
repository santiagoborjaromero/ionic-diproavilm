import { Component, OnInit, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-movs-edit',
  templateUrl: './movs-edit.page.html',
  styleUrls: ['./movs-edit.page.scss'],
  standalone:false
})
export class MovsEditPage implements OnInit {
  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);
  public readonly loadingCtrl = inject(LoadingController);
  
  public title: string = "Movimientos";
  
  public user: any = {};
  public scope: Array<any>=[];
  public loading: any;

  public scopeR:boolean=false;
  public scopeW:boolean=false;
  public scopeD:boolean=false;

  constructor() { }

  ngOnInit() {}

  ngOnDestroy(): void {
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
      this.getData();
    },800)
  }

  getData(){}
}
