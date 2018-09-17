var dataModel;
var viewModel;


function DataModel() {
    var self = this;
    var infoWindow = new google.maps.InfoWindow();

    // Set inital map location
    self.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.5440307, lng: 12.131067 } ,
        zoom: 14,
        disableDefaultUI: true
    });

    // Get wikipedia data, if successfull create info windows, if not inform
    // the user
    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
            action: 'query',
            titles: "Englischer Garten|Trausnitz Castle|Landshut Wedding|St. " +
                "Martin's Church, Landshut|Munich Airport",
            prop: "extracts",
            exintro: true,
            format: 'json'
        },
        dataType: 'jsonp',
    }).done(function(data) {
        wikiData = data.query.pages;

        // Create info-windows with wikipedia introduction
        self.locationMarkers.forEach(function (marker) {
            marker.infowindow = new google.maps.InfoWindow ({
                content: wikiData[marker.wiki_id].extract
            });

            marker.setMap(self.map);
            marker.content = wikiData[marker.wiki_id].extract;

            marker.addListener('click', function() {
               self.handleMarkerClick(this);
            });
        });
    }).fail(function() {
        alert("Cannot reach wikipedia, info-windows cannot be filled. " +
            "Please try again later.");
    });

    // Create location markers
    this.locationMarkers = [new google.maps.Marker({
        id: 1,
        wiki_id: 3772076,
        position: { lat: 48.5318984, lng: 12.1458682 },
        title: 'Burg Trausnitz, Landshut',
        content: ""
    }),
        new google.maps.Marker({
            id: 2,
            wiki_id:266998,
            position: { lat: 48.3540837, lng: 11.7965729 },
            title: 'Munich Airport',
            content: ""
        }),
        new google.maps.Marker({
            id: 3,
            wiki_id:403255,
            position: { lat: 48.1642359, lng: 11.6033635 },
            title: 'English Garden, Munich',
            content: ""
        }),
        new google.maps.Marker({
            id: 4,
            wiki_id:3730085,
            position: { lat: 48.5341438, lng: 12.1512669 },
            title: 'Sankt Martin Church, Landshut',
            content: ""
        }),
        new google.maps.Marker({
            id: 5,
            wiki_id:3771816,
            position: { lat: 48.5329512, lng: 12.1468782 },
            title: 'Landshut Wedding',
            content: ""
        })];

    this.openInfoWindow = function(marker) {
        if (infoWindow.marker != marker) {
            infoWindow.setContent(marker.content);
            infoWindow.marker = marker;

            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });

            infoWindow.open(self.map, marker);
        }
    };

    // Handle Click on Marker
    this.handleMarkerClick = function(marker) {

        // Open Info Window
        self.openInfoWindow(marker);

        // Start Bounce Animation
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () { marker.setAnimation(null); },
            750);
    };

    this.hideLocMarkers = function() {
        self.locationMarkers.forEach(function(marker) {
            marker.setMap(null);
        });
    };

    this.showLocMarkers = function(currentLocations) {
        self.hideLocMarkers();

        currentLocations.forEach(function(marker) {
            marker.setMap(self.map);
        });
    };
}


function ViewModel() {
    var self = this;

    self.filteredLocations = ko.observableArray([]);
    self.filterString = ko.observable();
    self.navVisible = ko.observable(true);

    // Get all Locations
    dataModel.locationMarkers.forEach(function(marker) {
        self.filteredLocations.push(marker);
    });

    // Filter locations, based on the filterString
    this.filterString.subscribe(function() {
        self.filteredLocations.removeAll();
        dataModel.locationMarkers.forEach(function (marker) {
            var filterString = self.filterString().toLowerCase();
            var title = marker.title.toLowerCase();

            if (title.includes(filterString)) {
                self.filteredLocations.push(marker);
            }

        });
        dataModel.showLocMarkers(self.filteredLocations());

    });

    // Toggle navigation
    self.toggleNav = function() {
        this.navVisible(!this.navVisible());
    };

    // Handle Click on Menu Item
    self.handleMenuItemClick = function(data) {
      dataModel.handleMarkerClick(dataModel.locationMarkers[data.id - 1]);
    };

}

initMap = function () {
    dataModel = new DataModel();
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);

};

gerror = function() {
    alert("Could not reach google maps api, please try again later.");
}
