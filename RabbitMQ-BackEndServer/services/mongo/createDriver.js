var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/uber_db');

var Driver;
var driverRidesList = new mongoose.Schema({
	rideId : {type: String},
	rating: {type:String},
	reviews: {type:String}
});


var driver = new mongoose.Schema({
	driver_id: {type: String, required:true, unique: true},
	d_email: {type: String, required: true, unique: true},
	d_first_name: {type: String},
	d_last_name: {type: String},
	d_image:{type:String},
	d_video:{type:String},
	d_rides:[driverRidesList]});


Driver = mongoose.model('driver_info', driver);



exports.Driver = Driver;


