import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValoradoPageRoutingModule } from './valorado-routing.module';

import { ValoradoPage } from './valorado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValoradoPageRoutingModule
  ],
  declarations: [ValoradoPage]
})
export class ValoradoPageModule {}
