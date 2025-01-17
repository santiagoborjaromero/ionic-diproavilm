import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {
  private readonly router = inject(Router) 
  constructor() { }

  ngOnInit() {

  }


  salir(){
    this.router.navigate(["/signin"])
  }

}
