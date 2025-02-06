import { Component, OnInit, inject } from '@angular/core';
import { Sessions } from 'src/app/core/helpers/session.helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  private readonly sess = inject(Sessions);


  public user: any = {};
  constructor() { }

  ngOnInit() {
    this.user = this.sess.get("user")
    console.log(this.user)
  }

}
