import { environment } from "./../environments/environment";
import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(private platform: Platform, private router: Router) {
    this.platform.backButton.subscribe(async () => {
      if (
        this.router.url === "/login" ||
        this.router.url === "/" ||
        this.router.url === "" ||
        this.router.url === "/home"
      ) {
        navigator["app"].exitApp();
      }
    });
  }
} 


 

