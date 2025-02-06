import { Component, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Sessions } from './core/helpers/session.helper';
import { GeneralService } from './core/services/general.service';

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
  
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'stats-chart-outline' },
    { title: 'Usuarios', url: '/usuarios', icon: 'person-circle-outline' },
    { title: 'Beneficiarios', url: '/beneficiarios', icon: 'briefcase-outline' },
    { title: 'Productos', url: '/productos', icon: 'cube-outline' },
    { title: 'Movimientos', url: '/movimientos', icon: 'file-tray-full-outline' },
    { title: 'Kardex', url: '/kardex', icon: 'layers-outline' },
    // { title: 'Reporte', url: '/reporte', icon: 'reader-outline' },
  ];
  
  public nombre: string = "Opciones"

  constructor() {}

  goLink(link:string){
    this.menuCtrl.close();
    this.svc.goRoute(link);
    // this.router.navigate([`/${link}`], { replaceUrl: true, skipLocationChange: false })
  }
  
  logout(){
    this.sess.clear();
    this.goLink("login");
  }
}
