import { Router } from "@angular/router";
import { ApiService } from "./../services/api.service";
import { UtilService } from "./../services/util.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
declare var google;
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild("map", { static: true }) mapEle: ElementRef;
  map: any;
  marker: any;
  lat=30.3753;
  lng=69.3451;
  constructor(
    public util: UtilService,
    public api: ApiService,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadmap(this.lat, this.lng, this.mapEle);
  }

  logout() {
    this.util.show();
    this.api.logout().then(() => {
      this.util.hide();

      localStorage.clear();

      this.router.navigate(["/login"]);
    });
  }

  loadmap(lat, lng, mapElement) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: "all",
        elementType: "all",
        stylers: [{ saturation: -100 }],
      },
    ];

    const mapOptions = {
      zoom: 6,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, "test-app"],
      },
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: "Grayscale" });
    this.map.mapTypes.set("test-app", mapType);
    this.map.setMapTypeId("test-app");
    // this.addMarker(location);
  }
}
