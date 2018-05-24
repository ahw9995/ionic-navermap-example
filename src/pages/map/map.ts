import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var naver: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  private map: any;

  private toggleMapType: string;
  private bounds: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.toggleMapType = 'normal';
    this.loadMap();
  }

  loadMap() {
    let mapOptions = {
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      },
      center: new naver.maps.LatLng(37.3595704, 127.105399),
      zoom: 10
    }
    this.map = new naver.maps.Map('map', mapOptions);
  }

  /**
  * 맵 타입을 변경해준다.
  * Type
  * NORMAL: 기본맵
  * TERRAIN: 지형도
  * SATELLITE: 위성지도
  * HYBRID: 일반지도 + 위성지도
  **/
  changeMapType(type: any) {
    this.map.setMapTypeId(naver.maps.MapTypeId[type]);
    this.toggleMapType = type.toLowerCase();
  }

  getBounds() {
    this.bounds = this.map.getBounds();
    //_min, _sw, _max, _ne

  }

  changeCenter(lat: any, lon: any) {
    this.map.setCenter(this.makeNaverLatLng(37.3190922, 127.0851583));
  }

  changeBounds(minLat: any, minLon: any, maxLat: any, maxLon: any) {
    let bounds = new naver.maps.LatLngBounds(
      this.makeNaverLatLng(minLat, minLon),
      this.makeNaverLatLng(maxLat, maxLon)
    );
    this.map.fitBounds(bounds);
  }

  findPlace(address: any) {

  }

  makeNaverLatLng(lat: any, lon: any) {
    return new naver.maps.LatLng(lat, lon);
  }
}
