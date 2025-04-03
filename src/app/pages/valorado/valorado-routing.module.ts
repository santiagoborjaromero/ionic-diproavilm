import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValoradoPage } from './valorado.page';

const routes: Routes = [
  {
    path: '',
    component: ValoradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValoradoPageRoutingModule {}
