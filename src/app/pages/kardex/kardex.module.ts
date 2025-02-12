import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KardexPageRoutingModule } from './kardex-routing.module';

import { KardexPage } from './kardex.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KardexPageRoutingModule
  ],
  declarations: [KardexPage]
})
export class KardexPageModule {}
