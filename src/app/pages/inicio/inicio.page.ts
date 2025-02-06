import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';



@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  private readonly router = inject(Router)
  private readonly navCtrl = inject(NavController)
  private readonly loadingCtrl = inject(LoadingController)
  
  current_year = 2025;

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    this.cambioPantalla()
    
  }
  
  cambioPantalla = async () => {
    setTimeout(()=>{
      this.router.navigate(["/login"])
    },2000)
  }

}
