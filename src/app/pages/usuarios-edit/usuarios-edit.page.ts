import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-edit',
  templateUrl: './usuarios-edit.page.html',
  styleUrls: ['./usuarios-edit.page.scss'],
  standalone:false
})
export class UsuariosEditPage implements OnInit {
  private readonly router = inject(Router)

  public Titulo: string ="Usuario - Edición";

  constructor() { }

  ngOnInit() {
  }

  getData(lod:boolean=false){

  }

  back(){
    this.router.navigate([`/users`],  { replaceUrl: true, skipLocationChange: true })
  }

}
