var markers = [];
var map
var typingTimer;
var doneTypingInterval = 2000; //

// geocoder ve infowindow globaldeyken çalışmıyor.

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 41.0422066 , lng: 29.006703700000003}
    });

    map.addListener('click', function(event) {
        addMarker(event.latLng);
    });
//  Adresi yazdıktan 2 sn sonra harita sorgusunu çalıştırır.
    $('#address').on('keyup', function () {
        clearTimeout(typingTimer);
        $('#submit').removeAttr("disabled");
        if (this.value != "")
        typingTimer = setTimeout(geocodeAddress, doneTypingInterval);
    });

    $('#address').on('keydown', function () {
        clearTimeout(typingTimer);
    });
}

// haritaya tıklanıldığında marker oluşturur.
function addMarker(location) {
    lat = location.lat();
    lng = location.lng();
    var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)}; // geocodera lokasyon gönderir.
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK')
        {
            if (results[0]) {
                infowindow.setContent(lat.toString() + ', ' + lng.toString());
                infowindow.open(map, marker);
                $('#address').val(results[0].formatted_address);
                $('#latlng').val(lat.toString() + ', ' + lng.toString());
            } else {
                window.alert('No results found');
            }
        }
        else {
        }
    });
    map.panTo(location); //marker konulan yere odaklanır.
    setMapOnAll(null);
    markers.push(marker);
}
// Adres yazıldığında marker oluşturur.
function geocodeAddress() {

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            var location = results[0].geometry.location,
                lat = location.lat(),
                lng = location.lng();
            infowindow.setContent(lat.toString() + ', ' + lng.toString()); // marker üzerindeki info ekranını doldurur.
            $('#latlng').val(lat.toString() + ', ' + lng.toString()); // formdaki latlng girdisini doldurur.
            infowindow.open(map, marker);
            setMapOnAll(null);
            markers.push(marker);
        } else {
            $('#latlng').val(null);
        }
    });
}
// önceki markerları siler.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
