import { Component, OnInit, inject } from '@angular/core';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {

  
  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);

  public user: any = {};
  constructor() { }

  ngOnInit() {
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);
  }

}
