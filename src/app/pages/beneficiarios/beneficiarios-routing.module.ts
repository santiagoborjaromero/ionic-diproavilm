import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeneficiariosPage } from './beneficiarios.page';

const routes: Routes = [
  {
    path: '',
    component: BeneficiariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficiariosPageRoutingModule {}
