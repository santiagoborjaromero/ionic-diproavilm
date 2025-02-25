import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovsEditPage } from './movs-edit.page';

const routes: Routes = [
  {
    path: '',
    component: MovsEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovsEditPageRoutingModule {}
