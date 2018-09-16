var dataModel;
var viewModel;


function DataModel() {
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.5440307, lng: 12.131067 } ,
        zoom: 14,
        disableDefaultUI: true
    });

    this.wikiData =

    this.locationMarkers = [new google.maps.Marker({
        id: 1,
        wiki_id: 3772076,
        position: { lat: 48.5318984, lng: 12.1458682 },
        title: 'Burg Trausnitz, Landshut'
    }),
        new google.maps.Marker({
            id: 2,
            position: { lat: 48.5347372, lng: 12.1491855 },
            title: 'St. Jodok, Landshut'
        }),
        new google.maps.Marker({
            id: 3,
            position: { lat: 48.1642359, lng: 11.6033635 },
            title: 'English Garden, Munich'
        }),
        new google.maps.Marker({
            id: 4,
            position: { lat: 48.5341438, lng: 12.1512669 },
            title: 'Sankt Martin Church, Landshut'
        }),
        new google.maps.Marker({
            id: 5,
            position: { lat: 48.1400823, lng: 11.5709193 },
            title: 'Micheal Jackson Memorial, Munich'
        })];

    self.locationMarkers.forEach(function (marker) {

        var infowindow = new google.maps.InfoWindow ({
            content: "hello"
        });

        marker.setMap(map);
        marker.addListener('click', function() {
            infowindow.open(map, marker)
        });
    });

    //https://en.wikipedia.org/w/api.php?action=query&pageids=3772076&prop=extracts&format=json

    $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
            action:'query',
            pageids: 3772076,
            prop:"extracts",
            exintro: true,
            format:'json'
        },
        dataType:'jsonp',
        success: function(data) {
            console.log(data.query.pages[3772076].extract);

        }
    });





}



function ViewModel() {
    var self = this;

    this.filteredLocations = ko.observableArray([]);

    this.navVisible = ko.observable(true);

    this.filteredLocations = dataModel.locationMarkers;

    this.toggleNav = function() {
        this.navVisible(!this.navVisible());
        console.log(this.navVisible())
    }

}





initMap = function () {
    dataModel = new DataModel();
    viewModel = new ViewModel();
    ko.applyBindings(viewModel);

};
