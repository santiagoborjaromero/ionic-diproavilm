import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit {
  private readonly svc = inject(GeneralService)
  
  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    this.cambioPantalla()
    
  }
  
  cambioPantalla = async () => {
    setTimeout(()=>{
      this.svc.goRoute("login")
    },2000)
  }

}
