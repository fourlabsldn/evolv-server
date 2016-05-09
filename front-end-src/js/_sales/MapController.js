/* globals google*/
import MarkerClusterer from './MarkerClusterer.js';

export default class MapController {
  constructor(targetSelector) {
    this.markers = [];
    this.map = this.initMap(targetSelector);
  }

  initMap(targetSelector) {
    const options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 14,
      scrollwheel: false,
      maxZoom: 17,
    };

    const map = new google.maps.Map(document.querySelector(targetSelector), options);
    return map;
  }

  createRandomMarkers(amount = 5, map = this.map) {
    const lngSpan = 0.17;
    const latSpan = 0.03;
    const myLatLng = new google.maps.LatLng(51.500524, -0.1769147);
    const markers = [];

    if (map === this.map) {
      this.clearAllMarkers(this.markers);
      this.markers = markers;
    }

    // Create some markers
    for (let i = 1; i < amount; i++) {
      const location = new google.maps.LatLng(
        myLatLng.lat() - latSpan / 2 + latSpan * Math.random(),
        myLatLng.lng() - lngSpan / 2 + lngSpan * Math.random());

      const marker = new google.maps.Marker({
        position: location,
        map,
      });

      markers.push(marker);
    }

    this.createCluster(markers, map);
    this.centerOnMarkers(markers, map);
    return markers;
  }

  /**
   * @method createMarkersFromCoordinates
   * @param  {Array} coordinates Each element must have a latitude and a longitude
   * @param  {Object} map   Google Maps Object
   * @return {Array[Object]}
   */
  createMarkersFromCoordinates(coordinates, map = this.map) {
    const markers = [];

    if (map === this.map) {
      this.clearAllMarkers(this.markers);
      this.markers = markers;
    }

    // Create some markers
    for (const coord of coordinates) {
      const location = new google.maps.LatLng(coord.latitude, coord.longitude);
      const marker = new google.maps.Marker({
        position: location,
        map,
      });

      markers.push(marker);
    }

    this.centerOnMarkers(markers, map);
    return markers;
  }

  centerOnMarkers(markers = this.markers, map = this.map) {
    const bounds = new google.maps.LatLngBounds();
    for (const marker of markers) {
      bounds.extend(marker.getPosition());
    }

    // Center the map according to our markers.
    map.fitBounds(bounds);
  }

  createCluster(markers = this.markers, map = this.map) {
    const markerClustererOptions = {
      styles: [{
        textColor: 'white',
        url: 'img/marker.svg',
        height: 52,
        width: 31,
      }],
      minimumClusterSize: 1,
    };

    const markerCluster = new MarkerClusterer(map, markers, markerClustererOptions);
    return markerCluster;
  }

  clearAllMarkers(markers = this.markers) {
    while (markers.length) {
      markers.pop().setMap(null);
    }

    return markers;
  }

  triggerResize(map = this.map) {
    google.maps.event.trigger(map, 'resize');
    // map.setZoom(map.getZoom());
    map.setZoom(16);
  }

}
