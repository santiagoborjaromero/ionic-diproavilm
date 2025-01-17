import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  private readonly router = inject(Router)
  private readonly loadingCtrl = inject(LoadingController)
  
  current_year = 2025;

  constructor() { }

  ngOnInit() {
    this.cambioPantalla()
  }
  
  cambioPantalla = async () => {
    setTimeout(()=>{
      this.router.navigate(["/signin"])
    },2000)
  }

}
