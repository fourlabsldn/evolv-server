/* globals google*/
/* eslint-env browser */

import MarkerClusterer from './_MarkerClusterer.js';

export default class MapController {
  constructor(mapContainer) {
    this.markers = [];
    this.map = this.initMap(mapContainer);
    return this;
  }

  initMap(targetObject) {
    const options = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 14,
      scrollwheel: false,
      maxZoom: 17
    };

    const map = new google.maps.Map(targetObject, options);
    return map;
  }

  /**
   * @method createMarkersFromCoordinates
   * @param  {Array<Object>} coordinates Each element must have a latitude and a longitude
   * @param  {String} coordinates[].latitude
   * @param  {String} coordinates[].latitude
   * @param  {String} coordinates[].url
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
        icon: '/img/marker.svg',
        map
      });

      markers.push(marker);

      // Make marker clickable
      google.maps.event.addListener(marker, 'click', () => {
        if (coord.url && typeof coord.url === 'string') {
          window.location.href = coord.url;
        }
      });
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
        url: '/img/marker.svg',
        height: 52,
        width: 31
      }],
      minimumClusterSize: 2
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
