import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { Transmission } from './core/middleware/interceptor.middleware';
import { BaseChartDirective } from 'ng2-charts';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    BaseChartDirective,
    HttpClientModule,
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withFetch()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS , useClass: Transmission, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
