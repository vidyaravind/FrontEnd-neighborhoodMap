'use strict';
var map;
var fourSquareUrl;
var marker;
var markers = [];
var CLIENT_ID='HFL5YZCURJPD00BQUGRDJK5WN2YET54N2KZPJHU4LOCZ0HXN';
var CLIENT_SECRET='N3DUX3TQWRCSREJHHZGPPXCKY2RRIXARDZKHOCPZZT5HGHHX';
var fourSquareBaseUrl='https://api.foursquare.com/v2/venues/search?client_id=' +
    CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160105&query=';
var infoWindow;
var infoWindows = [];
var windowContent;
var bounds;
var initLocs;
var locationNum = 0;

/**
 * Initialize mapOptions to get the map and its contents
 */
function initialize() {
    //adding options to the map zoom level and setting the center for the map
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(35.644033, -121.1875503),
        mapTypeControl: false,
        disableDefaultUI: true
    };

    var geocoder = new google.maps.Geocoder();
    bounds = new google.maps.LatLngBounds();

    //assigning the map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //calls method to store the marker information to markers array and infowindow to infowindows array
    for (var i =0; i< initLocs.length ; i ++){
        var address = initLocs[i].address;
        geocoder.geocode({'address':address}, addMarker(i));
    }
}

/**
 * Add a marker and an infoWindow for a location,
 * store data to markers and infoWindows array respectively
 * @param {number} index - the index of a location or marker
 * @return {function} geocodeCallBack - a callback function
 */
function addMarker(index){

    var geocodeCallBack = function(results,status){

        if(status == google.maps.GeocoderStatus.OK){
            //push each marker to markers array
            marker = new google.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/purple.png',
                    size: new google.maps.Size(25, 40),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(12.5, 40)
                },
                shape: {
                    coords: [1, 25, -40, -25, 1],
                    type: 'poly'
                }
            });
            markers.push(marker);

            infoWindow = new google.maps.InfoWindow();
            //push each infowindow to infowindows array
            infoWindowContent(index,function(windowContent){
                infoWindow.setContent(windowContent);
                infoWindows.push(infoWindow);
            });

            autoCenter(results[0].geometry.location);
            //click a marker to show the animation and infowindow
            google.maps.event.addListener(marker, 'click', function () {
                var self = this;

                //open corresponding info window
                infoWindowContent(index, function (windowConent) {
                    infoWindow.setContent(windowContent);
                    infoWindow.open(map, self);
                });
                toggleBounce(self);
                //stop bounce after 3 second
                setTimeout(stopBounce,3000);
                function stopBounce(){
                    self.setAnimation(null);
                }
            });

        }else{
            alert('location fail to geocode : ' + status);
        }
    }
    return geocodeCallBack;

}

/**
 * Fit map to markers
 * @param {object} location - a location includes latitude and longitude
 */
function autoCenter(location){
    ++locationNum;
    bounds.extend(location);
    if(locationNum === initLocs.length){
        map.fitBounds(bounds);
    }
}

/**
 * Get Json data from foursquare API, show data in infowindow
 * @param {number} index - the index of a location or marker
 * @param {function} infoWindowCallback - a callback function
 */
function infoWindowContent(index,infoWindowCallback){
    fourSquareUrl = fourSquareBaseUrl + initLocs[index].title + '&ll='+ initLocs[index].lat + ','+ initLocs[index].lng;
    $.getJSON(fourSquareUrl)
        .done(function (data){
            var venue = data.response.venues[0];
            var markerName = venue.name;
            var markerAddress = venue.location.formattedAddress;
            var markerPhone = (venue.contact.formattedPhone === undefined)? 'None': venue.contact.formattedPhone;
            windowContent ='<div class="info-window"><p><strong>Name: </strong>' + markerName+ '</p>' +
                '<p><strong>Address: </strong>  ' + markerAddress + '</p>' +
                '<p><strong>Phone: </strong>' + markerPhone + '</p></div>';
            infoWindowCallback(windowContent);
        }).fail(function(jqxhr, textStatus, error){
            alert('Failed to connect to Foursquare: ' + textStatus + ' ' + jqxhr.status + ' ' + error);
        }
    );
}

var currentMarker = null;
//function to animate only the current marker
function toggleBounce(marker) {
    if (currentMarker) currentMarker.setAnimation(null);
    // set this marker to the currentMarker
    currentMarker = marker;
    // add a bounce to this marker
    marker.setAnimation(google.maps.Animation.BOUNCE);

}

//Information about the different locations
//Provides information for the markers
//Details about the markers
initLocs = [{
    title: "Sea World",
    lat: 32.7639528,
    lng: -117.2267477,
    id: "nav0",
    address:"500 Sea World Dr,San Diego, CA 92109",
    visible: ko.observable(true),
    boolTest: true
},
    {
        title: "Disney Land",
        lat: 33.805825,
        lng: -117.9229715,
        id: "nav1",
        address: "1313 Disneyland DrAnaheim, CA 92802",
        visible: ko.observable(true),
        boolTest: true
    },
    {
        title: "Hearst Castle",
        lat: 35.644033,
        lng: -121.1875503,
        id: "nav2",
        address:"750 Hearst Castle Rd San Simeon, CA 93452",
        visible: ko.observable(true),
        boolTest: true
    },
    {
        title: "Monterey Bay Aquarium",
        lat: 36.618266,
        lng: -121.902339,
        id: "nav3",
        address:"886 Cannery Row Monterey, CA 93940",
        visible: ko.observable(true),
        boolTest: true
    },
    {
        title: "Golden Gate Bridge",
        lat: 37.819929,
        lng: -122.478255,
        id: "nav4",
        address: "Pier 39, San Francisco, CA 94111",
        visible: ko.observable(true),
        boolTest: true
    },
    {
        title: "Lake Elsinore",
        lat: 33.7529,
        lng: -116.0556,
        id: "nav5",
        address: "130 South Main Street ,Lake Elsinore, CA 92530",
        visible: ko.observable(true),
        boolTest: true
    },
    {
        title: "Santa Barbara Zoo",
        lat: 34.419527,
        lng: -119.668010,
        id: "nav6",
        address: "500 Ninos Dr, Santa Barbara, CA 93103",
        visible: ko.observable(true),
        boolTest: true
    }];


/**
 * Initialize the location data
 * @param {object} data - location data
 */
var Loc = function(data){
    this.title = ko.observable(data.title);
}


/**
 * viewModel of knockout
 */
var viewModel = function () {
    var self = this;

    //knock out observables
    self.query = ko.observable('');
    self.isDisplayOpen = ko.observable(true);
    self.locList = ko.observableArray([]);

    //stores all the locations in locList
    initLocs.forEach(function(locItem){
        self.locList.push(new Loc(locItem));
    });

    //toggle the display button
    self.toggleDisplay = function () {
        self.isDisplayOpen(!self.isDisplayOpen());
    };

    //show toggle text
    self.toggleDisplayText = ko.computed(function () {
        return self.isDisplayOpen() ? "hide" : "show";
    });

    //get toggle status
    self.toogleDisplayStatus = ko.computed(function () {
        return self.isDisplayOpen() ? true : false;
    });

    //trigger infowindow based on clicked location from the list
    self.openInfoWindow = function (clickedLoc) {
        var newMarker;
        for (var k = 0; k < initLocs.length; k++) {
            if (initLocs[k].title == clickedLoc.title) {
                newMarker = markers[k];
                toggleBounce(newMarker);
                infoWindowContent(k,function(windowContent){
                    infoWindow.setContent(windowContent);
                    infoWindow.open(map,newMarker);
                });
                setTimeout(function(){
                    newMarker.setAnimation(null);
                },3000);
            }
        }
    }

    //filters the list displayed based on search
    self.initLocs = ko.computed(function () {
        var search = self.query().toLowerCase();
        return ko.utils.arrayFilter(initLocs, function (marker) {
            if (marker.title.toLowerCase().indexOf(search) >= 0) {
                return marker.visible(true);
            } else {
                return marker.visible(false);

            }
        });
    });

    //search function to update the marker
    self.search = function (){
        searchAll(self.query());
    }

    //filters based on selection
    function searchAll(inputContent){
        self.locList.removeAll();
        for(var i=0; i<initLocs.length ; i ++){
            infoWindows[i].close();
            markers[i].setVisible(false);
            if(initLocs[i].title.toLowerCase().indexOf(inputContent.toLowerCase()) >= 0){
                self.locList.push(new Loc(initLocs[i]));
                markers[i].setVisible(true);
            }
        }
    }
};

ko.applyBindings(new viewModel());

