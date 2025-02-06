import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreatepassPage } from '../createpass/createpass.page';
import { ChangepassPage } from '../changepass/changepass.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  private readonly modalCtrl = inject(ModalController);

  public username:string = "";
  public password:string = "";
  public current_year:number = new Date().getFullYear();


  constructor() { }

  ngOnInit() {
  }

  signin(){}
  restablecerClave = async () => {
    const modal = await this.modalCtrl.create({
      component: CreatepassPage
    })
    return await modal.present();
  }
  changeClave = async () => {
    const modal = await this.modalCtrl.create({
      component: ChangepassPage
    })
    return await modal.present();
  }

}
