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
    styleUrls: ['./showmap.component.css'],
    moduleId: module.id,
})
export class ShowmapComponent implements OnInit {

    watchId; // stores the ID of the location watcher so we can stop it later
    start_location; // stores the location of the user when they first started tracking
    current_location; // stores the current location of the user    
    total_distance = 0;
    total_steps = 0;

    locations = []; // array which will store the locations

    latitude = -33.86;
    longitude = 151.20;
    zoom = 8;
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

    }

    getCurrentLocation() {
        if (!geolocation.isEnabled()) { // check if geolocation is not enabled
            geolocation.enableLocationRequest(); // request for the user to enable it
        }
        // Get current location with high accuracy
        geolocation.getCurrentLocation(
            {
                desiredAccuracy: Accuracy.high, // 3 meter accuracy 
                updateDistance: 5, // 5 meters
                timeout: 2000 // 2 seconds
            }
        ).
            then(function (loc) {
                if (loc) {
                    this.start_location = loc;
                    this.locations.push(this.start_location);
                    console.log(loc);
                    this.latitude = loc.latitude;
                    this.longitude = loc.longitude;
                    //viewModel.set('latitude', loc.latitude);
                    //viewModel.set('longitude', loc.longitude);
                }
            }, function (e) {
                console.log(e);
                alert(e.message);
            });
    }

    //Map events
    onMapReady(event) {
        console.log('Map Ready');

        this.mapView = event.object;

        console.log("Setting a marker...");

        var marker = new Marker();
        marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
        marker.title = "Sydney";
        marker.snippet = "Australia";
        marker.userData = { index: 1 };
        this.mapView.addMarker(marker);
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
