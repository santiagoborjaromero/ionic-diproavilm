import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovsEditPageRoutingModule } from './movs-edit-routing.module';

import { MovsEditPage } from './movs-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovsEditPageRoutingModule
  ],
  declarations: [MovsEditPage]
})
export class MovsEditPageModule {}
