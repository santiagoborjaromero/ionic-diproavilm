import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Functions {
    public toFloat(value: string): number {
      return parseFloat(value);
    }

    nombreMes(nmes:number){
      let nommes = "";
      switch(nmes){
        case 1: nommes = "Enero";break; 
        case 2: nommes = "Febrero";break; 
        case 3: nommes = "Marzo";break; 
        case 4: nommes = "Abril";break; 
        case 5: nommes = "Mayo";break; 
        case 6: nommes = "Junio";break; 
        case 7: nommes = "Julio";break; 
        case 8: nommes = "Agosto";break; 
        case 9: nommes = "Septiembre";break; 
        case 10: nommes = "Octubre";break; 
        case 11: nommes = "Noviembre";break; 
        case 12: nommes = "Diciembre";break; 
      }
      return nommes;
    }

    numberFormat(n:any,dec=2){
      if (typeof n === "string") n = parseFloat(n);
      return (n).toLocaleString(
        "en-US", 
        { 
          maximumFractionDigits: dec,
          minimumFractionDigits: dec  
        }
      );
    }

    truncate(num:any):number {
      let transf = num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
      return parseFloat(transf);
    }
  
    round(num:any, dec:any){
      return parseFloat(num.toFixed(dec));
    }

    arrSecurityPassword = () => {
      return [
      /*0*/ { id: "lowercase", caption: "Minúsculas", value: false },
      /*1*/ { id: "uppercase", caption: "Mayúsculas", value: false },
      /*2*/ { id: "number", caption: "Números", value: false },
      /*3*/ { id: "symbol", caption: "Símbolos", value: false },
      /*4*/ { id: "len", caption: "Longitud", value: false },
      /*5*/ { id: "fuerza", caption: "Fortaleza", value: "L" },
      ];
    };

    checkStrongPassword(text:string){
      let minusculasRegex = new RegExp("^(?=.*[a-z])(?=.{1,})");
      let mayusculasRegex = new RegExp("^(?=.*[A-Z])(?=.{1,})");
      let numerosRegex = new RegExp("^(?=.*[0-9])(?=.{1,})");
      let simbolosRegex = new RegExp("^(?=.*[!@#\$%\^&\*.,|])(?=.{1,})");
      let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
      let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
  
      let strong = "";
      let minForce:boolean = false;
      let mayForce:boolean = false;
      let numForce:boolean = false;
      let simForce:boolean = false;
      let lenForce:boolean = false;
  
      if (minusculasRegex.test(text)){
        minForce = true;
      }else{
        minForce = false;
      }
      if (mayusculasRegex.test(text)){
        mayForce = true;
      }else{
        mayForce = false;
      }
      if (numerosRegex.test(text)){
        numForce = true;
      }else{
        numForce = false;
      }
      if (simbolosRegex.test(text)){
        simForce = true;
      }else{
        simForce = false;
      }
      if (text.length >= 8){
        lenForce = true;
      }else{
        lenForce = false;
      }
      if (mediumRegex.test(text)){
        strong = "M";
      } else if (strongRegex.test(text)){
        strong = "S";
      }else{
        strong = "L";
      }
  
      let sec_pass = false;
      if (
        minForce && 
        mayForce && 
        numForce && 
        lenForce && 
        simForce && 
        (
          strong == 'M' ||
          strong == 'S'  
        )
      ){
        sec_pass = true;
      }else{
        sec_pass = false;
      }
      
      return [
        minForce,
        mayForce,
        numForce,
        simForce,
        lenForce,
        strong,
        sec_pass
      ]
    }

    

    handleErrors = (title:string = "", error:any = null)=>{
        let e = (JSON.stringify(error)).toLowerCase();
        let msgError = e;
        let match = false;

        if (!match){
        if (error.hasOwnProperty("message")){
            msgError = error.message;
            match = true;
        }
        }

        if (!match){
          if (error.hasOwnProperty("detail")){
              msgError = error.detail.toLowerCase();
              match = true;
          }
        }

        // console.log(msgError)
        

        let errs = [
            {message: "http failure response", messageResult: "<strong>Unable to connect the server !!!</strong><br>Http failure response", action: ""},
            {message: "unknown error", messageResult: "<strong>Unable to connect the server !!!</strong><br>Unknown error", action: ""},
            {message: "httperrorresponse", messageResult: "<strong>Unable to connect the server !!!</strong><br>HttpErrorResponse", action: ""},
            {message: "token expired", messageResult: "Token de seguridad expiró", action: "this.auth()"},
        ]
        
        let action = "";
        for ( let er of errs ){
            if (msgError.indexOf(er.message) > -1){
                msgError = er.messageResult;
                if (er.action != ""){
                    action = er.action
                }
            }
        }

        console.log("Error", e);
        // console.log(msgError, action)
        // if (action == ''){
        //     this.showMessage("error", title, msgError);
        // } else{
        //     // this.showLoading(msgError);
        //     console.log(msgError, action)
        //     // eval(action);
        //     if (action == "this.auth()"){
        //       this.auth();
        //     }
        // }
    }

    // auth(){
    //     let data  = JSON.parse(this.sessions.get("form"));
    //     this.authSvc.login(data).subscribe({
    //         next: (resp:any)=>{
    //             // if (Swal.isVisible()) Swal.close();
    //             if (resp.status == 'ok'){
    //                 if (resp.message.status){
    //                   this.sessions.set("user", JSON.stringify(resp.message));
    //                   this.sessions.set('statusLogged', 'true');
    //                   this.sessions.set('token', resp.message.token);
    //                   this.sessions.set('form', JSON.stringify(data));
    //                   this.router.navigate(['/home']);
    //                 } else {
    //                     this.handleErrors("Validacion", "El usuario no se encuentra activo")
    //                     this.sessions.set('statusLogged', 'false');
    //                 }
    //               } else {
    //                 this.handleErrors("Validacion", resp.message)
    //                 this.sessions.set('statusLogged', 'false');
    //               }
    //         },
    //         error: (err:any)=>{
    //           // if (Swal.isVisible()) Swal.close();
    //             this.handleErrors("Validacion", err)
    //             this.sessions.set('statusLogged', 'false');
    //         }
    //     })
    // }

    // showMessage(type:any, title:any, msg:any) {
    //     let that = this;
    //     Swal.fire({
    //         allowOutsideClick: false,
    //         allowEscapeKey: false,
    //         title: title,
    //         html: msg,
    //         icon: type,
    //         footer: environment.appName,
    //         showClass: { backdrop: 'swal2-noanimation', popup: '' },
    //         hideClass: { popup: '' }
    //     });
    // }

    // closeSwal(){
    //   if (Swal.isVisible()) Swal.close();
    // }

    // showLoading(text = '', time = 0) {
    //     let timerInterval:any;
    //     Swal.fire({
    //       allowOutsideClick: false,
    //       allowEscapeKey: false,
    //       title: text,
    //       text: "Espere un momento",
    //       timer: time > 0 ? time * 1000 : 0,
    //       timerProgressBar: true,
    //       footer: environment.appName,
    //       showClass: { backdrop: 'swal2-noanimation', popup: '' }, hideClass: {popup: ''},
    //       didOpen: () => {
    //         Swal.showLoading();
    //         if (time > 0) {
    //           timerInterval = setInterval(() => {
    //             const content = Swal.getHtmlContainer();
    //             if (content) {
    //               const b:any = content.querySelector('b');
    //               if (b) {
    //                 b.textContent = Swal.getTimerLeft();
    //               }
    //             }
    //           }, 100);
    //         }
    //       },
    //       willClose: () => {
    //         clearInterval(timerInterval);
    //       }
    //     }).then((result:any) => {
    //       /* Read more about handling dismissals below */
    //       if (result.dismiss === Swal.DismissReason.timer) {
    //         //console.log('I was closed by the timer');
    //       }
    //     });
    //   }
}