import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone:false
})
export class SigninPage implements OnInit {
  private readonly router = inject(Router) 

  public username: string ="";
  public password: string ="";
  public current_year: string ="2025";

  constructor() { }

  ngOnInit() {
  }


  signin(){
    this.router.navigate(["/profile"])
  }


}
