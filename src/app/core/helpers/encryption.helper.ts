import { Injectable } from '@angular/core'
import * as CryptoJS from 'crypto-js';
import { Global } from "../config/global.config";

@Injectable({
  providedIn: 'root',
})

export class Encryption {
  constructor() {
  }

  encryp(value:any){
    var key = CryptoJS.enc.Utf8.parse(Global.secret);
    var iv = CryptoJS.enc.Utf8.parse(Global.secret2);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        // keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let res = encrypted.toString()
    // console.log("encryp", res, value)
    return res;
  }

  decrypt(value:any){
    var key = CryptoJS.enc.Utf8.parse(Global.secret);
    var iv = CryptoJS.enc.Utf8.parse(Global.secret2);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        // keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let dec = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log("decrypt", `>${dec}<`, value)
    return dec
  }


  encryp2(value:any){
    var key = CryptoJS.enc.Utf8.parse(Global.secret);
    var iv = CryptoJS.enc.Utf8.parse(Global.secret2);
    var encrypted = CryptoJS.AES.encrypt(value.toString(), key,
    {
        // keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    let res = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    // console.log("encryp", res, value)
    return res;
  }

  convertRequest(value:string = ""){
    let desencriptado = null;
    try{
      let base64 = atob(value);
      desencriptado = JSON.parse(this.decrypt(base64))
    }catch(ex){
      console.log(ex)
    }
    return desencriptado
  }

  convertResponse(value:any){
     let encriptado = this.encryp(value);
    let base64 = btoa(encriptado);
    return base64;
  }


}