import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovsPage } from './movs.page';

const routes: Routes = [
  {
    path: '',
    component: MovsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovsPageRoutingModule {}
