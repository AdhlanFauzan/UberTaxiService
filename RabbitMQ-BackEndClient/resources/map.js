var pickup_location_lat;
var pickup_location_lng;
var drop_off_lat;
var drop_off_lng;
var pick_up_time;
var drop_off_time;
var journey_duration_in_minutes;
var journey_distance;
var map;
var Polylineroute;
var source_city;
var destination_city;

function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
center: {lat: 37.3382, lng: 121.8863},
zoom: 13
});

var pickUpelement = document.getElementById('pac-input');
var dropOffElement = document.getElementById('pac-output');

var autocompletePickUp = new google.maps.places.Autocomplete(pickUpelement);
autocompletePickUp.bindTo('bounds', map);
autocompletePickUp.set('sourcetype' , 'pickup');

var autocompleteDropoff = new google.maps.places.Autocomplete(dropOffElement);
autocompleteDropoff.bindTo('bounds', map);
autocompleteDropoff.set('sourcetype' , 'dropoff');


var infowindow = new google.maps.InfoWindow();
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(initialLocation);
  });
}

 var directionsService = new google.maps.DirectionsService;
 var directionsDisplay = new google.maps.DirectionsRenderer({
map: map,
draggable: true
});

directionsDisplay.setPanel(document.getElementById('right-panel'));

addListenerToSearch(autocompletePickUp, map,directionsService,directionsDisplay);
addListenerToSearch(autocompleteDropoff, map,directionsService,directionsDisplay);
 }

function addListenerToSearch(autocomplete, map,directionsService,directionsDisplay) {
    autocomplete.addListener('place_changed', function() {
      var marker = new google.maps.Marker({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5
    },
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

    if (autocomplete.get('sourcetype') === 'pickup') {
        pickup_location_lat = place.geometry.location.lat();
        pickup_location_lng = place.geometry.location.lng();

        for (var i = 0; i < place.address_components.length; i++) {
            component = place.address_components[i];
            if (component["types"].indexOf("locality") > -1) {
                source_city =component.long_name;
                alert(source_city);
            }
        }
    }
    else if(autocomplete.get('sourcetype') === 'dropoff') {
        drop_off_lat = place.geometry.location.lat();
        drop_off_lng = place.geometry.location.lng();
        for (var i = 0; i < place.address_components.length; i++) {
            component = place.address_components[i];
            if (component["types"].indexOf("locality") > -1) {
                destination_city =component.long_name;
                alert(destination_city);
            }
        }
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);


    if (document.getElementById('pac-input').value && document.getElementById('pac-output').value) {
        calculateAndDisplayRoute(map,directionsService,directionsDisplay);
    }
    });
    }

function calculateAndDisplayRoute(map,directionsService,directionsDisplay) {
if (Polylineroute != null) {
    Polylineroute.setMap(null);
    Polylineroute.setPath(null);
}


console.log(document.getElementById('pac-input').value);
console.log(document.getElementById('pac-output').value);

directionsService.route({
origin:  document.getElementById('pac-input').value,
destination:  document.getElementById('pac-output').value,
travelMode: google.maps.TravelMode.DRIVING
}, function(response, status) {
if (status === google.maps.DirectionsStatus.OK) {
directionsDisplay.setDirections(response);
 autoRefresh(map, response.routes[0].overview_path);
console.log(response.routes);

var route = response.routes[0];
var leg = route.legs[0];
var distance = leg.distance.text;
var duration = leg.duration.value;
var duration_in_minute = (leg.duration.value)/60;


journey_distance = distance;
journey_duration_in_minutes = duration_in_minute;

} else {
  window.alert('Directions request failed due to ' + status);
}
});
}

function autoRefresh(map, pathCoords) {
    var i, marker;
    Polylineroute = new google.maps.Polyline({
        path: [],
        geodesic : true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        editable: false,
        map:map
    });
    marker=new google.maps.Marker({map:map, icon:"http://s18.postimg.org/r24kyjy9h/Screen_Shot_2015_11_21_at_7_57_18_PM.png"});

    for (i = 0; i < pathCoords.length; i++) {
        setTimeout(function(coords) {
            Polylineroute.getPath().push(coords);
            moveMarker(map, marker, coords);
        }, 200 * i, pathCoords[i]);
    }
}

function moveMarker(map, marker, latlng) {
    marker.setPosition(latlng);
    map.panTo(latlng);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function getTimeString(date) {
    var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    
	var localISOTime = (new Date(date - tzoffset)).toISOString().substring(0, 19).replace('T', ' ');
    return localISOTime;
}
function getDateString( date) {
    var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	var localISOTime = (new Date(date - tzoffset)).toISOString().substring(0, 10);
    return localISOTime;
}
var app = angular.module("customerHomeApp", []);

app.controller('customerHomeController',function($scope, $http,$window,$interval) {
	$scope.currentride=false;
	$http({
        method: 'POST',
        url: '/getCurrentRide',
        data:{"user_type":"CUST"}
      }). then(function(response) {
    	 if(response.data.result[0])
    	{
    		 $scope.currentride=true;
    		 $scope.currentRide={driver_name:response.data.result[0].driver_first_name,source_city:response.data.result[0].source_city,destination_city:response.data.result[0].destination_city};
    	} 
      });

	   $scope.profile_pic="default.jpeg";
		$http({
	        method: 'GET',
	        url: '/getCustomerDetails',
	        
	      }). then(function(response) {
	    	 $scope.profile_pic=response.data.image;
	    	  $scope.customer=response.data.info[0];
	    	  
	      });
$scope.myRides = function () {
			$scope.rides=[];
			$http({
		        method: 'GET',
		        url: '/customerRideHistory'
		        
		      }). then(function(response) {
		    	  angular.forEach(response.data,function(rides)
		    		{
		    		  $scope.rides.push({pickUpDate:new Date(rides.pick_up_date).toISOString(),
		    			  driver:rides.driver_last_name,
		    			  fare:rides.total_fare,
		    			  city:rides.destination_city,
		    			  driver_first_name:rides.driver_first_name,
		    			  source_city:rides.source_city,
		    			  credit_card:rides.c_cc_number,
		    			  base_fare: rides.base_fare,
		    			 time_fare:rides.time_fare,
		    			  	distance_fare:rides.distance_fare,
		    				speed:rides.ride_speed,
		    				duration:rides.ride_duration,
		    					distance:rides.ride_distance
		    			  
		    		  }); 
		    		});
		      },function(response){
		      alert(response.data);
		      });
		}
$scope.startRide = function () {

    pick_up_time = new Date();
    alert(journey_duration_in_minutes);
    drop_off_time = addMinutes(pick_up_time, journey_duration_in_minutes);
    var journeydate = getDateString(pick_up_time);
    var pickUpTimeString = getTimeString(pick_up_time);
    alert(pickUpTimeString);
    var dropOffTimeString = getTimeString(drop_off_time);
    console.log(drop_off_time);
console.log(dropOffTimeString);
    $http({
      method: 'Post',
          url: '/createRide',
          data:{
              "pickup_location_lat":pickup_location_lat,
      "pickup_location_long":pickup_location_lng,
      "drop_location_lat":drop_off_lat,
      "drop_location_long":drop_off_lng,
      "pick_up_date": pickUpTimeString,
      "temp_drop_off_date":dropOffTimeString ,
     // "customer_id": "1234" ,
      "driver_id": $scope.selectedDriver.driver_id ,
      "ride_duration": String(journey_duration_in_minutes),
      "ride_distance" : journey_distance,
      "driver_first_name": $scope.selectedDriver.d_first_name,
      "driver_last_name": $scope.selectedDriver.d_last_name,
      "source_city": source_city,
      "journey_date":journeydate,
      "destination_city": destination_city}
       }).success(function(response){
           alert("Request Sent Successfully");
         console.log("connResult:>>"+$scope.workInfoResults);
          }).error(function(error){
          alert("error in friends");
      });
}
//$scope.showDrivers = function () {
//	$http({
//        method: 'GET',
//        url: '/showDrivers'
//        
//      }). then(function(response) {
//    	 alert("Driver Details Fetched");
//    	 alert(response.data[0].driverID);
//    	 
//    	 var objectsWithinRange =[];
//    	 
//    	     	 for (var i =0; i < response.data.length ; i++) {
//    	     		 var object = response.data[i];
//    	     		 driverLat = object["driverLat"];
//    	     		 driverLong = object["driverLong"];
//    	              var locationToPut = new google.maps.LatLng(driverLat,driverLong);
//    	              objectsWithinRange.push(locationToPut);
//    	     	 }
//    	 if (navigator.geolocation) {
// 	        navigator.geolocation.getCurrentPosition(function(position) {
// 	            console.log(position);
// 	           var currentlocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
// 	          map.setCenter(currentlocation);});}
//    	 alert(response.data);
//    	  
//     });
//	
//}
$scope.showDrivers = function () {
	
	$http({
        method: 'GET',
        url: '/showDrivers'
        
      }). then(function(response) {
    	
    	 
         var objectsWithinRange =[];
          $scope.driversInfo = [];

    	 for (var i =0; i < response.data.length ; i++) {
    		 var object = response.data[i];
    		 driverLat = object["driverLat"];
    		 driverLong = object["driverLong"];
             var locationToPut = new google.maps.LatLng(driverLat,driverLong);
             objectsWithinRange.push(locationToPut);
    	 }
    	 
    	    if (navigator.geolocation) {
    	        navigator.geolocation.getCurrentPosition(function(position) {
    	            console.log(position);
    	           var currentlocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    	           map.setCenter(currentlocation);
    	          
    	           var radius = new google.maps.Circle({
    	                  center : currentlocation,
    	                     radius : 16000,
    	                     strokeColor: '#FF0000',
    	                      strokeOpacity: 0.8,
    	                      strokeWeight: 2,
    	                      fillColor: '#FF0000',
    	                      fillOpacity: 0.15,
    	                         map : map
    	                     } );

    	                    for (var i = 0; i < objectsWithinRange.length; i++) {
    	                        var isPresent = radius.getBounds().contains(objectsWithinRange[i]);
    	                        var position = objectsWithinRange[i];
    	                        console.log("Inside Marker"+position);
    	                        if (isPresent) {
    	                        	
    	                        	$scope.driversInfo.push({driverID:response.data[i].driverID,d_first_name:response.data[i].d_first_name,d_last_name:response.data[i].d_last_name});
    	                        	console.log("in response data " +response.data[i]);
    	                        	console.log(response);
    	                        	
    	                            var marker = new google.maps.Marker({
    	                              map: map,
    	                              position: position
    	                            });
    	                            marker.setVisible(true);
    	                            marker.setMap(map);
    	                        }
    	                     } console.log("In scope variable " +$scope.driversInfo[0].d_first_name);
    	      });
    	    }
    	    
    	  
      });
}

$interval(function(){
	
	},1000);


$scope.chosenDriver = function(driver_id,d_first_name,d_last_name){
	alert(driver_id);
	$scope.selectedDriver={driver_id:driver_id,d_first_name:d_first_name,d_last_name:d_last_name};
	
}

$scope.showDriverInfo=function(driver_id){
	alert(driver_id);
	 $http({
	      method: 'Post',
	          url: '/customer_driverprofile',
	          data:{"driver_id":driver_id
	        	  	}
	       }).success(function(response){
	           alert("Going to driver Profile");
	           window.open('customer_driverprofile');
	        // console.log("connResult:>>"+$scope.workInfoResults);
	          }).error(function(error){
	          alert("error in fetching");
	      });
	
}


$scope.deleteCustomer = function(){
	
	alert("deleting customer self");
	$http({method: 'GET', url: '/customer_deleteself'}).then(function successCallback(response) {
	    
	  
		window.location.assign("/goodBye");
			    	
	}, function errorCallback(response) {});           	
	
}

//$scope.uploadImage = function(file) {alert("huu");
//    file.upload = Upload.upload({
//      url: '/uploadCustImage',
//      data: {picture: file}
//    }); 
//    file.upload.then(function (response) {alert(response.data);
//        $timeout(function () {
//          file.result = response.data;
//        });
//    });}
    // Added by Prajwal Kondawar
    $scope.deleteRideBill = function(){
    	
    	alert("deleting Ride / Bill");
    	$http({method: 'POST', url: '/deleteRideBill', data: {"ride_id": "5"}}).then(function successCallback(response) {
		    
    		alert("Ride / Bill deleted..");    
    		//window.location.assign("/customerhome");
    			    	
    	}, function errorCallback(response) {});           	
    	
    }

    
    // Added by Prajwal Kondawar
    $scope.searchBillByAttributes = function(){
    	
    	alert("Searching Bill By Attributes");
    	$http({method: 'POST', url: '/searchBillByAttributes', data: {"attributeType": $scope.attributeType, "attributeValue": $scope.attributeValue}}).then(function successCallback(response) {
		    
    		alert("Bill searched successfully");
    		console.log(response);
    		alert(response.data.result[0].ride_id);
    		alert(response.data.result[1].ride_id);
    		alert(response.data.result[2].ride_id);
    		alert(response.data.result[3].ride_id);
    		//window.location.assign("/customerhome");
    			    	
    	}, function errorCallback(response) {});           	
    	
    }
    
   
});

$(document).ready(function(){
	$('#uploadBtn').click(function(){alert("hello");
	    $.post("/uploadCustImage",
	    {
	       picture:picture,
	    },
	    function(data, status){
	        alert("Data: " + data + "\nStatus: " + status);
	    });
	});
	});