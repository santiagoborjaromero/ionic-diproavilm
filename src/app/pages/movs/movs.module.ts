import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovsPageRoutingModule } from './movs-routing.module';

import { MovsPage } from './movs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovsPageRoutingModule
  ],
  declarations: [MovsPage]
})
export class MovsPageModule {}
