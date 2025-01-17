import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepassPage } from './createpass.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepassPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepassPageRoutingModule {}
