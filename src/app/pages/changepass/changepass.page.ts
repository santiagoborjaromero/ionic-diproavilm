import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Sessions } from '../../core/helpers/session.helper';
import { GeneralService } from '../../core/services/general.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.page.html',
  styleUrls: ['./changepass.page.scss'],
  standalone: false
})
export class ChangepassPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sess = inject(Sessions);
  private readonly modalCtrl = inject(ModalController);
  // private readonly svc = inject(GeneralService)


  public username: string ="";
  public password: string ="";
  public old_password: string ="";
  public confirm_password: string ="";
  public seguridad_pass: string = "";
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
  
  regresar(){
    // this.router.navigate(["/signin"]);
    return this.modalCtrl.dismiss(null, 'cancel');
  }
  

}
