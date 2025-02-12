import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KardexPage } from './kardex.page';

const routes: Routes = [
  {
    path: '',
    component: KardexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KardexPageRoutingModule {}
