import { Component, OnInit, ViewChild } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { MapView, Marker, Position } from 'nativescript-google-maps-sdk';
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "ui/enums"; // used to describe at what accuracy the location should be get

// Important - must register MapView plugin in order to use in Angular templates
registerElement('MapView', () => MapView);

@Component({
    selector: 'ns-showmap',
    templateUrl: './showmap.component.html',
    moduleId: module.id,
})
export class ShowmapComponent implements OnInit {

    watchId; // stores the ID of the location watcher so we can stop it later
    start_location; // stores the location of the user when they first started tracking
    current_location; // stores the current location of the user    
    total_distance = 0;
    total_steps = 0;

    locations = []; // array which will store the locations

    latitude: number;
    longitude: number;
    zoom = 16;
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40, 40, 40, 40];
    mapView: MapView;

    lastCamera: String;

    constructor() {
    }

    ngOnInit() {
        this.latitude = 15.447819409392789;
        this.longitude = 120.93888133764267;
    }

    private getDeviceLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            geolocation.enableLocationRequest().then(() => {
                geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, updateDistance: 5, timeout: 10000 }).then(location => {
                    resolve(location);
                }).catch(error => {
                    reject(error);
                });
            });
        });
    }

    //Map events
    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;
        var markerSet = [];

        console.log("Setting a marker...");

        this.getDeviceLocation().then(result => {
            console.log('get location');
            this.latitude = result.latitude;
            this.longitude = result.longitude;

            this.mapView.addMarker(this.setMarker(this.latitude, this.longitude, 'red', 'Your Location', 'your Location'));
            this.mapView.addMarker(this.setMarker(this.latitude + 0.00087653, this.longitude + 0.000924, 'green', 'location1', 'location1'));
            this.mapView.addMarker(this.setMarker(this.latitude + 0.00126543, this.longitude + 0.0001524, 'green', 'location2', 'location2'));
            this.mapView.addMarker(this.setMarker(this.latitude + 0.0005327, this.longitude + 0.00053878, 'green', 'location3', 'location3'));

        }, error => {
            console.error(error);
        });


    }

    setMarker(lat: number, long: number, color: string = 'red', title: string = null, snippet: string = null): Marker {
        var marker = new Marker();
        marker.position = Position.positionFromLatLng(lat, long);
        marker.title = title;
        marker.snippet = snippet;
        marker.userData = { index: 1 };
        marker.color = color;
        return marker;
    }

    onCoordinateTapped(args) {
        console.log("Coordinate Tapped, Lat: " + args.position.latitude + ", Lon: " + args.position.longitude, args);
    }

    onMarkerEvent(args) {
        console.log("Marker Event: '" + args.eventName
            + "' triggered on: " + args.marker.title
            + ", Lat: " + args.marker.position.latitude + ", Lon: " + args.marker.position.longitude, args);
    }

    onCameraChanged(args) {
        console.log("Camera changed: " + JSON.stringify(args.camera), JSON.stringify(args.camera) === this.lastCamera);
        this.lastCamera = JSON.stringify(args.camera);
    }

    onCameraMove(args) {
        console.log("Camera moving: " + JSON.stringify(args.camera));
    }

}
