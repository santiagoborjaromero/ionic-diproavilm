import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.page.html',
  styleUrls: ['./usuarios-edit.page.scss'],
  standalone:false
})
export class UsuariosEditPage implements OnInit {
  private readonly router = inject(Router)
  private readonly svc = inject(GeneralService)

  public Titulo: string ="Usuario - Edición";

  constructor() { }

  ngOnInit() {
  }

  getData(lod:boolean=false){

  }

  back(){
    this.svc.goRoute("users")
  }

}
