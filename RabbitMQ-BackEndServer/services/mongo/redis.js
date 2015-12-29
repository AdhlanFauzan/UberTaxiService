var redis = require('redis');
var client = redis.createClient();
var async= require('async');

function addDriverLocation(driver,callback){
	var driver_id=driver.driver_id;
	var lat=driver.driverLat;
	var long=driver.driverLong;
	var d_first_name=driver.d_first_name;
	var d_last_name=driver.d_last_name;
	 var client = redis.createClient()
	    client.incr("idCounter", function(err, id) {
	        if (err) return callback(err, data)
	        console.log(id);
	        client.sadd("driverIds", id, function (err, data) {
	            if (err) return callback(err, data)
	            var key = "driver:"+id
	            console.log(key);
	            client.hmset(key, "driverID", driver_id, "driver_lat", lat, "driver_long",long,"d_first_name",d_first_name,"d_last_name",d_last_name,callback);
	        });
	    });
	
}
function getDrivers(msg,callback){
var driversList=[];
	client.smembers ("driverIds", function (err, id) {
		if(err) return 
		else
		{async.each(id,function(driver,callback){
			var key= "driver:" +driver;
			console.log(key);
			client.hgetall(key,function(err,reply){
				console.log(reply);
				console.log(reply.driverID);
				//console.log(reply.toString());
				driversList.push({"driverID":reply.driverID,"driverLat":reply.driver_lat,"driverLong":reply.driver_long,"d_first_name":reply.d_first_name,"d_last_name":reply.d_last_name});
				
				callback();
			});
			
			},function(err){
			    
			    if( err ) {
			      
			      console.log('A file failed to process');
			      callback(null,driversList);
			    } else {callback(null,driversList);
			     
			    }
			});
			
		
		}
	});
	
}
exports.addDriverLocation=addDriverLocation;
exports.getDrivers=getDrivers;