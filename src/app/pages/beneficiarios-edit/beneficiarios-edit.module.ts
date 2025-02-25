import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BeneficiariosEditPageRoutingModule } from './beneficiarios-edit-routing.module';

import { BeneficiariosEditPage } from './beneficiarios-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiariosEditPageRoutingModule
  ],
  declarations: [BeneficiariosEditPage]
})
export class BeneficiariosEditPageModule {}
