import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GeolocationProvider {

  constructor(private geolocation: Geolocation) {
    console.log('Hello GeolocationProvider Provider');
  }

  async geolocationCurrentPosition() {
    return await this.geolocation.getCurrentPosition().then((resp) => {
      return {'lat': resp.coords.latitude, 'lon': resp.coords.longitude};
    }).catch ((error) => {
      console.log('Error getting location');
    });
  }
}
