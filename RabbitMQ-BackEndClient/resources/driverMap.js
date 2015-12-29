var marker;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(initialLocation);
    });
  }

  var pickUpelement = document.getElementById('pac-input');

  var autocompletePickUp = new google.maps.places.Autocomplete(pickUpelement);
  autocompletePickUp.bindTo('bounds', map);

  addListenerToSearch(autocompletePickUp, map);
  }

  function addListenerToSearch(autocomplete, map) {
      autocomplete.addListener('place_changed', function() {
          if (marker != null) {
              marker.setMap(null);
          }
          marker = new google.maps.Marker({
      draggable: true,
      map: map
      });

      // infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
      }
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(14);
      }

      mylat = place.geometry.location.lat();
      mylng = place.geometry.location.lng();

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      });
      }