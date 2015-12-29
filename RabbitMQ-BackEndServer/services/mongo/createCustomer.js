var mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://localhost:27017/uber_db');

var Customer;

	var customerRideImage = new mongoose.Schema({
		path: {type:String}});
	var customerRidesList = new mongoose.Schema({
		rideId : {type: String,required: true},
		rating: {type:Number},
		reviews: {type:String},
		customerRideImages: [customerRideImage]
	});
	var customer = new mongoose.Schema({
		customer_id: {type: String, required:true, unique: true},
		c_email: {type: String, required: true, unique: true},
		c_first_name: {type: String},
		c_last_name: {type: String},
		c_image:{type:String},
		c_rides:[customerRidesList]});
		Customer = mongoose.model('customer_info', customer);

exports.Customer = Customer;