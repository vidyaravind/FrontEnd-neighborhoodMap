'use strict';
var map;

//Initialize mapOptions to get the map and its contents
function initialize() {
    //adding options to the map zoom level and setting the center for the map
    var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(35.644033, -121.1875503),
        mapTypeControl: false,
        disableDefaultUI: true
    };

    //assigning the map
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //calling setMarkers to load the markers on the page
    setMarkers(markers);

    //Determines if markers should be visible
    //This function is passed in the knockout viewModel function
    setAllMap();
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
//Based on the boolean map is set
function setAllMap() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].boolTest === true) {
            markers[i].holdMarker.setMap(map);
        } else {
            markers[i].holdMarker.setMap(null);
        }
    }
}

//Information about the different locations
//Provides information for the markers
//Details about the markers
var markers = [{
    title: "Sea World",
    lat: 32.7639528,
    lng: -117.2267477,
    streetAddress: "500 Sea World Dr",
    cityAddress: "San Diego, CA 92109",
    url: "https://seaworldparks.com/en/seaworld-sandiego/",
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Disney Land",
    lat: 33.805825,
    lng: -117.9229715,
    streetAddress: "1313 Disneyland Dr",
    cityAddress: "Anaheim, CA 92802",
    url: "https://disneyland.disney.go.com/",
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Hearst Castle",
    lat: 35.644033,
    lng: -121.1875503,
    streetAddress: "750 Hearst Castle Rd",
    cityAddress: "San Simeon, CA 93452",
    url: "http://hearstcastle.org/",
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Monterey Bay Aquarium",
    lat: 36.618266,
    lng: -121.902339,
    streetAddress: "886 Cannery Row",
    cityAddress: "Monterey, CA 93940",
    url: "www.montereybayaquarium.org/",
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Golden Gate",
    lat: 37.800856,
    lng: -122.398635,
    streetAddress: "Pier 39",
    cityAddress: "San Francisco, CA 94111",
    url: "http://www.goldengate.org/",
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Lake Tahoe",
    lat: 39.104083,
    lng: -119.957676,
    streetAddress: "3411 Lake Tahoe Blvd",
    cityAddress: "South Lake Tahoe, CA",
    url: "http://laketahoe.com/",
    id: "nav5",
    visible: ko.observable(true),
    boolTest: true
},
{
    title: "Lake Elsinore",
    lat: 33.7529,
    lng: -116.0556,
    streetAddress: " 130 South Main Street ",
    cityAddress: "Lake Elsinore, CA 92530",
    url: "http://www.lake-elsinore.org/",
    id: "nav6",
    visible: ko.observable(true),
    boolTest: true
}];


//Sets the markers on the map within the initialize function
//Sets the infoWindows to each individual marker
//The markers are inidividually set using a for loop
function setMarkers(location) {
    for (var i = 0; i < location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].lat, location[i].lng),
            map: map,
            title: location[i].title,
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

        //Binds infoWindow content to each marker
        location[i].contentString = location[i].title + '</strong><br><p>' +
        location[i].streetAddress + '<br>' +
        location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
        '" target="_blank">' + location[i].url + '</a>';


        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click marker to view infoWindow
        //zoom in and center location on click

        new google.maps.event.addListener(location[i].holdMarker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, this);
                map.setCenter(marker.getPosition());
                toggleBounce(location[i].holdMarker);
                getWikiLinks(location[i].title);
            };
        })(location[i].holdMarker, i));

        //Click nav element to view infoWindow
        //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function (marker, i) {
            return function () {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, marker);
                //location[i].holdMarker.setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(marker.getPosition());
                toggleBounce(location[i].holdMarker);
                getWikiLinks(location[i].title);
            };
        })(location[i].holdMarker, i));
    }
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
//Query through the different locations from nav bar with knockout.js
//only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable('')
};

//Does the filter based on the search string
viewModel.markers = ko.dependentObservable(function () {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function (marker) {
        if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });
}, viewModel);

ko.applyBindings(viewModel);

//show $ hide markers in sync with nav
$("#input").keyup(function () {
    setAllMap();
});

//ajax call to load wiki url in info window
function getWikiLinks(marker) {
    //construct wiki url to load
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+ marker+
    '&format=json&callback=wikiCallback';
    var settings = {
        url: wikiUrl,
        dataType: 'jsonp',
        timeout: 7000,
        success: function (response) {
            var articleStr = response[0];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
            $('.web-links').append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        },
        error: function (jq, status, error) {
            alert("Status: " + status); alert("Error: " + error);
        }
    };
    $.ajax(settings);
}
