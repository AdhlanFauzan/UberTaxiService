
var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var driver = require('./services/driver');
var admin = require('./services/admin');
var ride = require('./services/ride'); // Added by Prajwal Kondawar - 23/Nov/2015


var cnn = amqp.createConnection({
	host : '127.0.0.1'
});
var mongoose = require('mongoose');
var connection = mongoose.connect("mongodb://localhost:27017/uber_db");
var redis = require('redis');
var client = redis.createClient();

cnn.on('ready', function(){
	console.log("listening on customer_queue");

	cnn.queue('customer_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.handleRequest(message, function(err,res){
				console.log("Listening customer_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on driver_queue");
	cnn.queue('driver_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			driver.handleRequest(message, function(err,res){
				console.log("Listening driver_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on admin_queue");
	cnn.queue('admin_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.handleRequest(message, function(err,res){
				console.log("Listening admin_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId				});
			});
		});
	});
	
	
	/* #01 - Start */
	
	console.log("listening on ride_queue");
	cnn.queue('ride_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			ride.handleRequest(message, function(err,res){
				console.log("Listening ride_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
	/* #01 - End */
	
});