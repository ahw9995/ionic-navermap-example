import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';

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
  private markers = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private geolocationProvider: GeolocationProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    this.toggleMapType = 'normal';
    this.loadMap();
  }

  /**
  * 지도 객체를 생성 후 화면에 출력한다.
  **/
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

    /**
    * 이벤트 리스너 추가
    * 사용자가 맵을 확대/축소 하거나 이동할 때마다 무언가 작업을 해야할 경우 해당 function을 넣어주면 된다.
    * 예를 들어 맵이 이동될 때마다 현재 위치의 중심점에 마커를 찍어주는 기능을 연결한다면
    * naver.maps.Event.addListener(this.map, 'center_changed', res => (this.setCenter()));
    * 위와 같이 이벤트 리스너를 설정해주면 맵의 center가 변경, 즉 사용자가 드래그로 맵을 이동할 때마다 중심 포인트에 마커를 찍게 된다.
    **/
    naver.maps.Event.addListener(this.map, 'zoom_changed', res => (this.displayCenterMarker()));
    naver.maps.Event.addListener(this.map, 'center_changed', res => (this.displayCenterMarker()));

    // 지도 로드 시 지도 중심에 마커 표시
    this.displayCenterMarker();
  }

  /**
  * 맵 타입을 변경해준다.
  * Type
  * NORMAL: 기본맵
  * TERRAIN: 지형도
  * SATELLITE: 위성지도
  * HYBRID: 일반지도 + 위성지도
  **/
  changeMapType(type: string) {
    this.map.setMapTypeId(naver.maps.MapTypeId[type]);
    this.toggleMapType = type.toLowerCase();
  }

  /**
  * 현재 화면에 보이는 지도 영역의 좌표정보를 가져온다.
  * 리턴 값은 _min, _sw, _max, _ne
  **/
  getBounds() {
    let bounds = this.map.getBounds();
    return bounds;
  }

  /**
  * 현재 지도 중심의 위/경도 정보를 가져온다.
  **/
  getCenter() {
    let center = this.map.getCenter();
    console.log("latitude: " + center['_lat'] + " longitude: " + center['_lng']);
    return center;
  }

  /**
  * 지도의 중심위치를 입력한 위/경도 정보로 이동시킨다.
  **/
  changeCenter(lat: number, lon: number) {
    this.map.setCenter(this.makeNaverLatLng(lat, lon));
  }

  /**
  * 지도를 지정한 영역으로 이동시킨다.
  * 상단 왼쪽 위치의 위경도 정보와 하단 오른쪽 위치의 위경도 정보를 파라미터로 받는다.
  **/
  changeBounds(minLat: number, minLon: number, maxLat: number, maxLon: number) {
    let bounds = new naver.maps.LatLngBounds(
      this.makeNaverLatLng(minLat, minLon),
      this.makeNaverLatLng(maxLat, maxLon)
    );
    this.map.fitBounds(bounds);
  }

  findPlace(address: string) {
    let info = naver.maps.Service.geocode({address: address});
    naver.maps.Service.geocode({
        address: address
    }, function(status, response) {
        if (status !== naver.maps.Service.Status.OK) {
            return alert('Something wrong!');
        }

        let result = response.result, // 검색 결과의 컨테이너
            items = result.items; // 검색 결과의 배열

        // do Something
        info = items;
        let addr = info[0].address;
        let latitude =  info[0].point['x'];
        let longitude = info[0].point['y'];
    });
  }

  /**
  * 지도 위에 마커를 표시한다.
  **/
  setMarker(lat: number, lon: number) {
    var marker = new naver.maps.Marker({
      position: this.makeNaverLatLng(lat, lon),
      map: this.map
    });
    // 추후 마커를 삭제하기 위해 리스트에 마커 정보를 저장
    this.markers.push(marker);
  }

  /**
  * 지도 위에 표시한 모든 마커들을 삭제한다.
  **/
  clearMarker() {
    if (this.markers.length > 0) {
      for (let i = 0; i < this.markers.length; i++) {
        let marker = this.markers[i];
        marker.setMap(null);
      }
      // 마커정보를 저장해놨던 리스트를 초기화한다.
      this.markers = [];
    }
  }

  /**
  * 현재 위치로 지도 화면을 이동한다.
  * 현재 위치는 geolocation 라이브러리를 사용하여 가져온다.
  * providers의 geolocation.ts 를 참고하면 된다.
  **/
  changeCenterToCurrentPosition() {
    this.geolocationProvider.geolocationCurrentPosition().then((result) => {
        this.changeCenter(result['lat'], result['lon']);
    });

  }

  /**
  * 위/경도 정보를 받아 naver map 객체로 생성하여 리턴한다.
  **/
  makeNaverLatLng(lat: number, lon: number) {
    return new naver.maps.LatLng(lat, lon);
  }

  /**
  * 예제: 지도 중심의 위/경도에 마커를 표시
  **/
  displayCenterMarker() {
    let center = this.getCenter();
    this.setMarker(center['_lat'], center['_lng']);
  }
}
