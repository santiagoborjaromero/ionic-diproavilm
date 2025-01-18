import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly menuCtrl = inject(MenuController)
  
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'stats-chart-outline' },
    { title: 'Usuarios', url: '/usuarios', icon: 'person-circle-outline' },
    { title: 'Beneficiarios', url: '/beneficiarios', icon: 'briefcase-outline' },
    { title: 'Productos', url: '/productos', icon: 'cube-outline' },
    { title: 'Movimientos', url: '/movimientos', icon: 'file-tray-full-outline' },
    { title: 'Kardex', url: '/kardex', icon: 'layers-outline' },
    // { title: 'Reporte', url: '/reporte', icon: 'reader-outline' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public nombre: string = "Santiago Borja Romero"

  constructor() {}

  goLink(link:string){
    this.menuCtrl.close();
    this.router.navigate([`/${link}`])
  }

  logout(){
    /* Limpieza de peferences */

    this.menuCtrl.close();
    this.goLink("signin");
  }
}
