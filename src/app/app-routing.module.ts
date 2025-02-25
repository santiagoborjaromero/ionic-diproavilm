import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'changepass',
    loadChildren: () => import('./pages/changepass/changepass.module').then( m => m.ChangepassPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'createpass',
    loadChildren: () => import('./pages/createpass/createpass.module').then( m => m.CreatepassPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:idUser',
    loadChildren: () => import('./pages/usuarios/edit/edit.page').then( m => m.EditPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'beneficiarios',
    loadChildren: () => import('./pages/beneficiarios/beneficiarios.module').then( m => m.BeneficiariosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./pages/movs/movs.module').then( m => m.MovsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'kardex',
    loadChildren: () => import('./pages/kardex/kardex.module').then( m => m.KardexPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
