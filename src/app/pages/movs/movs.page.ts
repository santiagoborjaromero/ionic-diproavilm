import { Component, OnInit, inject } from '@angular/core';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { MenuService } from 'src/app/core/services/menu.service';

@Component({
  selector: 'app-movs',
  templateUrl: './movs.page.html',
  styleUrls: ['./movs.page.scss'],
  standalone: false
})
export class MovsPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly menuSvc = inject(MenuService);

  public user: any = {};
  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    this.user = this.sess.get("user")
    let menu = this.user.menu;
    this.menuSvc.updateMenu(menu);
  }

}
