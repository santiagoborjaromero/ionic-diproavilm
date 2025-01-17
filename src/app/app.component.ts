import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Usuarios', url: '/folder/profile', icon: 'mail' },
    { title: 'Productos', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Ingreso', url: '/folder/favorites', icon: 'heart' },
    { title: 'Egreso', url: '/folder/archived', icon: 'archive' },
    { title: 'Stock', url: '/folder/trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  public nombre: string = "Santiago Borja Romero"

  constructor() {}
}
