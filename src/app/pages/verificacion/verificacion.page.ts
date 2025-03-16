import { Component, OnInit, inject } from '@angular/core';
import * as moment from 'moment';
import { Functions } from 'src/app/core/helpers/functions.helper';
import { Sessions } from 'src/app/core/helpers/session.helper';
import { GeneralService } from 'src/app/core/services/general.service';


@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
  standalone: false
})
export class VerificacionPage implements OnInit {

  private readonly sess = inject(Sessions);
  private readonly svc = inject(GeneralService);
  public readonly func = inject(Functions);

  public current_time: any;
  public elapsed: string = "00:00";
  public codigo: string = "";
  public timeerror: number = 0;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.onTime();
    }, 800)
  }

  onTime() {
    let totalSeconds = 5 * 60;

    const timer = setInterval(() => {
      const minutesLeft = Math.floor(totalSeconds / 60);
      const secondsLeft = totalSeconds % 60;

      this.elapsed = `${minutesLeft.toString().padStart(2, '0')}:${secondsLeft
        .toString()
        .padStart(2, '0')}`;

      totalSeconds--;

      if (totalSeconds < 0) {
        clearInterval(timer);
        console.log('⏰ Tiempo terminado!');
        this.back();
      }

    }, 1000);
  }

  back() {
    this.sess.clear();
    this.svc.goRoute("login");
  }

  signin = async () => {
    let errMsg = "";
    let error: boolean = false;

    if (!error && this.codigo == "") {
      errMsg = "Debe llenar el codigo de verificacion";
      error = true;
    }

    if (error) {
      this.svc.showAlert(errMsg, "", "error", [
        {
          text: 'Aceptar',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ]);

      return;
    }

    let frmData = {
      codigo: this.codigo,
    };

    await this.svc.apiRest("POST", "codigoauth", frmData).subscribe({
      next: (resp) => {
        if (resp.status == "ok") {
          this.svc.goRoute("dashboard");
        } else {
          this.svc.showAlert(resp.message, "", "error", [
            {
              text: 'Aceptar',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]);
          this.timeerror++;
          if (this.timeerror>=3){
            this.back();
          }
        }
      },
      error: (err) => {
        this.svc.showAlert(err, "", "error", [
          {
            text: 'Aceptar',
            role: 'cancel',
            data: {
              action: 'cancel',
            },
          },
        ]);

      }
    })
  }




}
