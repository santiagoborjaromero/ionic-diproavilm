import { Component, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Sessions } from './core/helpers/session.helper';
import { GeneralService } from './core/services/general.service';
import { MenuService } from './core/services/menu.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private readonly menuCtrl = inject(MenuController);
  private readonly sess = inject(Sessions);
  private readonly svc = inject(GeneralService);
  private readonly menuSvc = inject(MenuService);

  public user:any;
  
  public appPages:any = [
    // { id: 0, title: 'Dashboard', url: '/dashboard', icon: 'stats-chart-outline' },
    // { title: 'Usuarios', url: '/usuarios', icon: 'person-circle-outline' },
    // { title: 'Beneficiarios', url: '/beneficiarios', icon: 'briefcase-outline' },
    // { title: 'Productos', url: '/productos', icon: 'cube-outline' },
    // { title: 'Movimientos', url: '/movimientos', icon: 'file-tray-full-outline' },
    // { title: 'Kardex', url: '/kardex', icon: 'layers-outline' },
  ];

  public lstMenu:Array<any> = [];
  
  public nombre: string = "Opciones"

  constructor() {}

  ngOnInit(): void {
    
    this.menuSvc.menuItems$.subscribe(items => {
      if (items.length != this.lstMenu.length){
        this.lstMenu = items;
        
        this.appPages = [{ id: 0, title: 'Dashboard', url: '/dashboard', icon: 'stats-chart-outline' }];
        
        this.lstMenu.forEach( (m:any) => {
          let found = false;
          this.appPages.forEach( (me:any) => {
            if (m.order == me.order){
              found = true;
            }
          });
  
          if (!found){
            this.appPages.push({
              title: m.name, 
              url: `/${m.route}`, 
              icon: m.icon_movil
            })
          }
        });
      }
    })
  }

  goLink(link:string){
    this.menuCtrl.close();
    this.svc.goRoute(link);
  }
  
  logout(){
    let frmData = {
      app: "movil"
    };
    this.svc.apiRest("POST","logout",frmData).subscribe({
      next: (resp:any) => {
        if (resp.status == "ok"){
          this.sess.clear();
          this.goLink("login");
        }else{
          this.svc.showToast("error", resp.message)
        }
      },
      error: (err) => {

      }
    })

  }
}
