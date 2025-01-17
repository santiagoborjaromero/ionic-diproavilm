import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepassPageRoutingModule } from './createpass-routing.module';

import { CreatepassPage } from './createpass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepassPageRoutingModule
  ],
  declarations: [CreatepassPage]
})
export class CreatepassPageModule {}
