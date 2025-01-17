import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sessions } from '../../core/helpers/session.helper';
import { GeneralService } from '../../core/services/general.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone:false
})
export class SigninPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sess = inject(Sessions);
  // private readonly svc = inject(GeneralService)


  public username: string ="";
  public password: string ="";
  public current_year: string ="2025";

  constructor(
    // private svc:GeneralService
  ) { }

  ngOnInit() {
    this.sess.set("logged",{value: false})
  }


  signin(){
    let data = {
      username: this.username,
      password: this.password
    }
    // GeneralService.prototype.login(data).subscribe({
    // // this.svc.login(data).subscribe({
    //   next: (resp) => {
    //     console.log(resp);
    //   },
    //   error: (err) => {
    //     console.log(err)
    //   }
    // });

    this.router.navigate(["/profile"]);
  }
  
  changeClave(){
    this.router.navigate(["/changepass"]);
  }
  
  restablecerClave(){
    this.router.navigate(["/createpass"]);
  }


}
