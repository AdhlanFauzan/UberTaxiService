/*
 * CHANGE HISTORY LOG:
 */

/* 
 * Version:     Initial
 * Developer:   Prajwal Kondawar 
 * Date:        23-Nov-2015
 * Description: 1. New APIs - "createRide(), endRide()".
 * 				2. createRide() API prepares payload for RIDE_HISTORY table. All the parameters come from client side.
 * 				3. endRide() API prepares payload for BILLING_INFORMATION table. All the parameters come from client side.
 */


var mq_client = require('../rpc/client');
var ejs= require('ejs');

// Initial - Start

function createRide (req,res){
	console.log("In Create Ride");
	//var ride_id = req.param('ride_id');
	var pickup_location_lat = req.param('pickup_location_lat');
    var pickup_location_long = req.param('pickup_location_long');
    var drop_location_lat = req.param('drop_location_lat');
    var drop_location_long = req.param('drop_location_long');
    var pick_up_date = req.param('pick_up_date');
    var temp_drop_off_date = req.param('temp_drop_off_date');
    var customer_id = req.session.customer_id;
    //var customer_id = req.param('customer_id');
    var driver_id = req.param('driver_id');
    var ride_duration = req.param('ride_duration');
    var ride_distance = req.param('ride_distance');
    var driver_first_name = req.param('driver_first_name');
    var driver_last_name = req.param('driver_last_name');
    var source_city = req.param('source_city');
    var destination_city = req.param('destination_city');
    var journey_date = req.param('journey_date');
        
    var msg_payload = {
    	//"ride_id":ride_id,
        "pickup_location_lat" : pickup_location_lat,	
        "pickup_location_long" : pickup_location_long,
        "drop_location_lat" : drop_location_lat,
        "drop_location_long" : drop_location_long,
        "pick_up_date" : pick_up_date,
        "temp_drop_off_date" : temp_drop_off_date,
        "customer_id" : customer_id,
        "driver_id" : driver_id,
        "ride_duration": ride_duration,
        "ride_distance": ride_distance,
        "driver_first_name": driver_first_name,
        "driver_last_name": driver_last_name,
        "source_city": source_city,
        "destination_city": destination_city,
        "journey_date": journey_date,
        "type": "createRide"
    };

    console.log("Inside createRide API");
    
    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
}


function endRide (req,res){
	
	//var billing_id = req.param('billing_id');
	/*var distance_covered = req.param('distance_covered');
    var source_location = req.param('source_location');
    var destination_location = req.param('destination_location');
    var ride_id = req.param('ride_id');
    var time_duration = req.param('time_duration');
    var total_bill = req.param('total_bill');
    var tax_collected = req.param('tax_collected');
    var ride_fare = req.param('ride_fare');
    var avg_speed = req.param('avg_speed');
    var driver_first_name = req.param('driver_first_name');
    var driver_last_name = req.param('driver_last_name');
    var c_cc_number = req.param('c_cc_number');*/
    
	var ride_id = req.param('ride_id');
	var customer_id = req.param('customer_id');
    var driver_id = req.session.driver_id;
    var ride_speed=req.param("ride_speed");
    var ride_distance=req.param("ride_distance");
    var ride_duration=req.param("ride_duration");
    //var pick_up_date=req.param("pick_up_date");
	//var driver_id = req.param('driver_id');
    var temp_drop_off_date = req.param('temp_drop_off_date');

    var msg_payload = {
    	//"billing_id":billing_id,
        /*"distance_covered" : distance_covered,	
        "source_location" : source_location,
        "destination_location" : destination_location,*/
        "ride_id" : ride_id,
        "ride_speed":ride_speed,
        "ride_distance":ride_distance,
        "ride_duration":ride_duration,
        //"pick_up_data":pick_up_date,
        //"time_duration" : time_duration,
        //"total_bill" : total_bill,
        //"tax_collected": tax_collected,
        //"ride_fare": ride_fare,
        /*"avg_speed": avg_speed,
        "driver_first_name": driver_first_name,
        "driver_last_name": driver_last_name,
        "c_cc_number": c_cc_number,*/
        "customer_id": customer_id,
        "driver_id": driver_id,
        "temp_drop_off_date": temp_drop_off_date, 
        "type": "endRide"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
}




/*function editRide (req,res){
	
	var billing_id = req.param('billing_id');
	var distance_covered = req.param('distance_covered');
    var source_location = req.param('source_location');
    var destination_location = req.param('destination_location');
    var ride_id = req.param('ride_id');
    var time_duration = req.param('time_duration');
    var total_bill = req.param('total_bill');
    var tax_collected = req.param('tax_collected');
    var ride_fare = req.param('ride_fare');
    var avg_speed = req.param('avg_speed');
    var customer_id = req.param('customer_id');
    var driver_id = req.session.driver_id;
    
    var msg_payload = {
    	"billing_id":billing_id,
        "distance_covered" : distance_covered,	
        "source_location" : source_location,
        "destination_location" : destination_location,
        "ride_id" : ride_id,
        "time_duration" : time_duration,
        "total_bill" : total_bill,
        "tax_collected": tax_collected,
        "ride_fare": ride_fare,
        "avg_speed": avg_speed,
        "customer_id": customer_id,
        "driver_id": driver_id,
        "type": "endRide"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
}*/



function deleteRideBill (req,res){
	
	var ride_id = req.param('ride_id');
	    
    var msg_payload = {
    	"ride_id":ride_id,
        "type": "deleteRideBill"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
}


function customerRideHistory (req, res){
	
	var customer_id = req.session.customer_id;
    
    var msg_payload = {
    	"customer_id": customer_id,
        "type": "customerRideHistory"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
       
        if (err) {
            console.log(err);
            res.status(500).send("Something Went Wrong");
        } else {
            console.log("about results" + results.result);
            res.status(200).send(results.result);
        }
    });
	
}


function driverRideHistory (req, res){
	
	var driver_id = req.session.driver_id;
    
    var msg_payload = {
    	"driver_id": driver_id,
        "type": "driverRideHistory"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.status(200).send(results.result);
        }
    });
	
}


function rideHistory (req, res){
	
	var id = req.param('id');
	var historyType = req.param('historyType');
	
    var msg_payload = {
    	"id": id,
    	"historyType": historyType,
        "type": "rideHistory"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
	
}



function searchBillByAttributes (req, res){
	
	var attributeType = req.param('attributeType');
	var attributeValue = req.param('attributeValue');
	
    var msg_payload = {
    	"attributeType": attributeType,
    	"attributeValue": attributeValue,
        "type": "searchBillByAttributes"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.end(JSON.stringify(results));
        }
    });
	
}

exports.getCurrentRide=function (req, res){
	
	var user_id;
	var user_type = req.param('user_type');
	
	if (user_type === "CUST"){
		
		user_id = req.session.customer_id;
		
	}else if (user_type === "DRIV"){
		
		user_id = req.session.driver_id;
		
	}
		
    var msg_payload = {
    	"user_id": user_id,
    	"user_type": user_type,
    	"type": "getCurrentRide"
    };

    mq_client.make_request('ride_queue', msg_payload, function(err,results) {
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log("about results" + results);
            res.status(200).send(JSON.stringify(results));
        }
    });
	
}


//Initial - End

exports.createRide=createRide; // #01
exports.endRide=endRide; // #01
//exports.editRide=editRide; // #01
exports.deleteRideBill=deleteRideBill; // #01
exports.customerRideHistory=customerRideHistory; // #01
exports.driverRideHistory=driverRideHistory; // #01
exports.rideHistory=rideHistory; // #01
exports.searchBillByAttributes=searchBillByAttributes; // #01

// Uber Statistics API

//exports.areaRides=areaRides; // #01

//exports.test=test;