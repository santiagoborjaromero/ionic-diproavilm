import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosEditPageRoutingModule } from './usuarios-edit-routing.module';

import { UsuariosEditPage } from './usuarios-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosEditPageRoutingModule
  ],
  declarations: [UsuariosEditPage]
})
export class UsuariosEditPageModule {}
