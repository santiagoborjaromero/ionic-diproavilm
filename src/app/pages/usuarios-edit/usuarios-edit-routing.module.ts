import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosEditPage } from './usuarios-edit.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosEditPageRoutingModule {}
