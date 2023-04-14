import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ToastController,
  NavController,
} from "@ionic/angular";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UtilService {
  loader: any;
  isLoading = false;
  private loggedIn = new Subject<any>();
  private profile = new Subject<any>();

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private navController: NavController
  ) {}

  back() {
    this.navController.back();
  }

  async show(msg?: any) {
    this.isLoading = true;
    return await this.loadingCtrl
      .create({
        message: msg,
        spinner: "bubbles",
        duration: 3000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => console.log("abort presenting"));
          }
        });
      });
  }
  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl
      .dismiss()
      .then(() => console.log("dismissed"));
  }
  /*
    Show Warning Alert Message
    param : msg = message to display
    Call this method to show Warning Alert,
    */
  async showWarningAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: "Warning",
      message: msg,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async showSimpleAlert(msg: any, header?: any) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: msg,
      buttons: ["OK"],
    });

    await alert.present();
  }
  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: "Error",
      message: msg,
      buttons: ["OK"],
    });

    await alert.present();
  }

  /*
     param : email = email to verify
     Call this method to get verify email
     */
  async getEmailFilter(email: any) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(email)) {
      const alert = await this.alertCtrl.create({
        header: "Warning",
        message: "Please enter valid email",
        buttons: ["OK"],
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }
  /*
    Show Toast Message on Screen
     param : msg = message to display, color= background
     color of toast example dark,danger,light. position  = position of message example top,bottom
     Call this method to show toast message
     */
  async showToast(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon,
    });
    toast.present();
  }
  async shoNotification(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
          handler: () => {
            // console.log('Cancel clicked');
          },
        },
      ],
    });
    toast.present();
  }

  async errorToast(msg: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  makeid(length: any) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  translate(str: any) {
    return str;
  }
}
