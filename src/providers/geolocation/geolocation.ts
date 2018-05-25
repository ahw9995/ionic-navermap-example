import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

export interface CurrentPosition{
    latitude: number;
    longitude: number;
}

@Injectable()
export class GeolocationProvider {

  private currentPosition: CurrentPosition;

  constructor(private geolocation: Geolocation) {
    console.log('Hello GeolocationProvider Provider');
  }

async getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPosition = {latitude: resp.coords.latitude, longitude: resp.coords.longitude};
      console.log(this.currentPosition);
      return this.currentPosition;
    }).catch ((error) => {
      console.log('Error getting location');
    });
  }
}
