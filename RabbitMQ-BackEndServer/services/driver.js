var mysql = require('./mysql');
var mongo = require('./mongo/createDriver');
var Driver = mongo.Driver;
var fs = require('fs');
var redis = require('./mongo/redis');


function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "signupDriver":
			signupDriver(msg,callback);
			break;
		case "loginDriver":
			loginDriver(msg,callback);
			break;
		case "getdriverdetails":
			getdriverdetails(msg,callback);
			break;
		case "updatedriver":
			updatedriver(msg,callback);
			break;
		case "imageupload":
			imageupload(msg,callback);
			break;
		case "videoupload":
			videoupload(msg,callback);
			break;
		case "driver_deleteself":
			driver_deleteself(msg,callback);
			break;
		case "driverLocation":
			driverLocation(msg,callback);
			break;
	}
	//return;
}


function signupDriver(msg, callback){

	console.log("IN SIGN UP DRIVER AT SERVER");
	var driver_id = msg.driver_id;
	var email = msg.email;
    var password = msg.password;
    var firstname = msg.firstName;
    var lastname = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipcode = msg.zipCode;
    var phonenumber = msg.phoneNumber;
    var d_car_number = msg.d_car_number;
    var d_car_name = msg.d_car_name;
    var d_activated = "N";
    var d_available = "Y";
    var d_deleted = "N";
    
    var response;
   
    var sqlQuery = "INSERT INTO driver_info (driver_id, d_first_name, d_last_name, d_address, " +
    				"d_city, d_state, d_zipcode, d_phonenumber, d_email, d_car_name, d_car_number, d_password, " +
    				"d_activated, d_available, d_deleted)  VALUES (" + 
    				"'"	+ driver_id + "'," +
    				"'" + firstname + "'," +
    				"'" + lastname + "'," +
    				"'" + address+ "'," +
    				"'" + city + "'," +
    				"'" + state + "'," +
    				"'" + zipcode + "'," +
    				"'" + phonenumber + "'," +
    				"'" + email + "'," +
    				"'" + d_car_name + "'," +
    				"'" + d_car_number + "'," +
    				"'" + password + "'," +
    				"'" + d_activated + "'," +
    				"'" + d_available + "'," +
    				"'" + d_deleted + "')";
    
    
    mysql.fetchData(function(err,result){
    	
    if(err){ 
		
		response =({status:500,message: "Driver! Registeration failed" });
        console.log("SYSTEM ERROR in creating driver");
		callback(null,response);
		
	}
	else{											//checking for duplicate driver_id
		
		console.log("IN FETCHDATA TO CHECK DUPLICATE IN ELSE");
		if(result.length > 0){
			
			response =({status:300, message: "Driver with this ID already exists" });
			//console.log("message from database : " + JSON.stringify(result));
			console.log("DRIVER ID ALREADY EXISTS");
			callback(null,response);			
		}
		else{									//checking for duplicate email id
			
			console.log("IN FETCHDATA NO DUPLICATE DRIVER_ID");
			console.log("checking for duplicate email");
			mysql.fetchData(function(err,result){	
				
				if (err) {
					
	                response =({status:500,message: "Driver! Registration failed" });
	                console.log("SYSTEM ERROR IN FETCHDATA TO INSERTION FAILED");
	                callback(null,response);
	            }
	            else {
	            	
	            	if(result.length > 0){
	            		
	            		response =({status:300, message: "Driver with this EMAIL already exists" });
	        			//console.log("message from database : " + JSON.stringify(result));
	        			console.log("DUPLICATE EMAIL ALREADY EXISTS");
	        			callback(null,response);	            		
	            	}
	            	else{						//checking for duplicate car number
	            		
	            		console.log("checking car number duplicacy");
	            		mysql.fetchData(function(err,result){
	            			
	            			if(err){ 
	            				
	            				console.log("Could not retrieve driver details");
	            				callback(null,err);
	            			}
	            			else{
	            				
	            				console.log("checking result length for car number");
	            				if(result.length > 0){
	            					
	            					console.log("IN IF");
	            					response =({status:300, message: "Driver with this CAR NUMBER already exists" });
	        	        			//console.log("message from database : " + JSON.stringify(result));
	        	        			console.log("DUPLICATE CAR NUMBER ALREADY EXISTS");
	        	        			callback(null,response)	            					
	            				}
	            				else{
	            					
	            					console.log("inserting data. sign up successfull");
	            					
	            					mysql.fetchData(function(err,result){
	            						
	            						console.log("IN SECOND FETCHDATA TO INSERTING DRIVER");
	            						if (err) {
	            							
	            			                response =({status:500,message: "Driver! Registration failed" });
	            			                console.log("SYSTEM ERROR IN FETCHDATA TO INSERTION FAILED");
	            			                callback(null,response);
	            			            }
	            			            else {
	            			            	
	            			               response = ({status:200,message: "Driver! Registeration Succesful" });
	            			               console.log("SUCCESS!!! DRIVER INSERTED TO MYSQL");
	            			               callback(null, response);	
	            			               
	            			               
	            			               
	            			               
	            			               console.log("going in mongo save");
	            			               var createMongoDriver = new Driver({
	            			   					driver_id: driver_id,
	            			   					d_email: email,
	            			   					d_first_name: firstname,
	            			   					d_last_name: lastname
	            			   				});
	            			               	
	            			               	console.log("GOING IN MONGO SAVE FUNCTION");
	            			               
	            			   				createMongoDriver.save(function(err) {
	            			   				
	            			   					console.log("In Mongo save function");
	            			   					if (err) {
	            			   					
	            			   						console.log("in mongo save function IN IFFFF ERROR");
	            			   						response =({status:500,message: "Driver! Registeration failed" });
	            			   						callback(null, response);
	            			   					}
	            			   					else {
	            			   				
	            			   						console.log("In Mongo save function IN ELSE SUCCESSFULL INSERTION");
	            			   						response = ({status:200,message: "Driver! Registration Succesful" });
	            			   						callback(null, response);
	            			   					}	            			               
	            			   				});
	            			            }
	            					},sqlQuery);
	            				}
	            			}
	            		}, "select * from driver_info where d_car_number = '" + d_car_number + "'");
	            	}
	            }     	
			}, "select * from driver_info where d_email = '" + email + "'");
		}
	}
	}, "select * from driver_info where driver_id = '" + driver_id + "'");
}


function loginDriver(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	var sqlQuery = "select * from driver_info where d_email = '" + email + "' and d_password = '" + password + "' and d_deleted != 'Y'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Driver! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("login driver data from MYSQL " + JSON.stringify(result));
				if(result.length > 0){
					
					console.log("DRIVER DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));
					console.log("flag for activation : " + result[0].d_activated);
					
					if(result[0].d_activated == "Y"){
						
						response =({status:200, message: "Driver! Login Successful", result: result[0]});						
					}
					else{
						
						response =({status:400, message: "Driver Not Activated"});												
					}
					callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "Driver! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}	




function updatedriver(msg,callback){
	
	var driver_id = msg.driver_id;
	var email = msg.email;
    var password = msg.password;
    var firstname = msg.firstName;
    var lastname = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipcode = msg.zipCode;
    var phonenumber = msg.phoneNumber;
    var car_number = msg.d_car_number;
    var car_name = msg.d_car_name;
	var response;
	
	var sqlQuery = "update driver_info set d_email = '" + email + "', d_password = '" + password + "', d_first_name = '" + firstname + "', d_last_name = '" + lastname + "'," +
					"d_address = '"+ address +"', d_city = '" + city + "', d_state = '" + state + "'," +
					"d_zipcode = '" + zipcode + "', d_phonenumber = '" + phonenumber+ "', d_car_name = '" + car_name + "'," +  
					"d_car_number = '" + car_number + "' where driver_id  = '" + driver_id + "'";
	
	
	
	console.log("driver updated query : " + sqlQuery);
	
	
	mysql.fetchData(function(err,result){
	
		if(err){ 
			
			console.log("Could not update driver details");
			callback(null,err);
		}
		else{
			
			console.log("result length : " + result.length);
			console.log("result length : " + JSON.stringify(result));	
		
			if(result.length > 0 && driver_id != result[0].driver_id){
			
				response =({status:300, message: "This EMAIL is used by another driver" });
				console.log("message from database : " + JSON.stringify(result));
				console.log("This EMAIL is used by another driver");
				callback(null,response);					
			}
			else{
				
				mysql.fetchData(function(err,result){
		
					if(err){ 
				
						console.log("Could not update driver details");
						callback(null,err);
					}
					else{
				
						console.log("result length : " + result.length);
						console.log("result length : " + JSON.stringify(result));	
				
						if(result.length > 0 && driver_id != result[0].driver_id){
					
							response =({status:300, message: "This CAR NUMBER is used by another driver" });
							console.log("message from database : " + JSON.stringify(result));
							console.log("This CAR NUMBER is used by another driver");
							callback(null,response);					
						}
						else{
				
							mysql.fetchData(function(err,result){
						
								if(err){ 
							
									console.log("Could not update driver details");
									callback(null,err);
								}
								else{
							
									response = ({status:200,message: "Driver details updated" });
 			               			console.log("DRIVER DETAILS UPDATED");
 			               			callback(null, response);			
								}
							},sqlQuery);					
						}				
					}
				}, "select * from driver_info where d_car_number = '" + car_number + "'");
			}
		}
	}, "select * from driver_info where d_email = '" + email + "'");
}	




function getdriverdetails(msg,callback){
	
	var driver_id = msg.driver_id;
	
	var response;
	
	var sqlQuery = "select * from driver_info where driver_id = '" + driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve driver details");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver details retrieved : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	



function driver_deleteself(msg,callback){
	
	var driver_id = msg.driver_id;
	
	var response;
	
	var sqlQuery = "update driver_info set d_deleted = 'Y' where driver_id = '" + driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not delete driver");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver deleted : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	






function imageupload(msg,callback){
	
	
	console.log("SEVER in imageupload function");
	
	var imageobject = msg.imageobject;
	var driver_id = msg.driver_id;
	var d_image = msg.d_image + ".jpg";
	
	
		               
		   			Driver.update({driver_id: driver_id}, {d_image: d_image} ,{upsert:true},function(err) {
		   				
		   				if (err) {
		   					
		   					console.log("in mongo save function error saving image");
		   					response =({status:500,message: "error saving image" });
		   					callback(null, response);
		   				}
		   				else {
		   			
		   					console.log("In Mongo save function IN ELSE image saved");
		   					response = ({status:200,message: "image saved to mongo" });
		   					callback(null, response);
		   				}	            			               
		   			});
	                 
	                 
};

//*Parveen
function videoupload(msg,callback){
	
	
	console.log("SERVER in videoupload function");
	
	var imageobject = msg.imageobject;
	var driver_id = msg.driver_id;
	var d_video = msg.d_video + ".mp4";
	
	
		               
		   			Driver.update({driver_id: driver_id}, {d_video: d_video} ,{upsert:true},function(err) {
		   				
		   				if (err) {
		   					
		   					console.log("in mongo save function error saving video");
		   					response =({status:500,message: "error saving video" });
		   					callback(null, response);
		   				}
		   				else {
		   			
		   					console.log("In Mongo save function IN ELSE video saved");
		   					response = ({status:200,message: "video saved to mongo" });
		   					callback(null, response);
		   				}	            			               
		   			});
	                 
	                 
};

function driverLocation(msg,callback){
	
	redis.addDriverLocation(msg,function(err,data){
		if(err){
			var response="Something wrong addin driver location";
			console.log(response);
			callback(null,response);
		}
		else{
		var response="Driver Inserted";
		console.log(response);
		callback(null,response);
		}
		
	});
	
	
}	










//
//function imageupload(msg,callback){
//	
//	
//	console.log("SEVER in imageupload function");
//	
//	var imageobject = msg.imageobject;
//	var driver_id = msg.driver_id;
//	
//	if(imageobject.size != 0){
//		
//		console.log("IN IF");
//	    var tmp_path = imageobject.path;
//	    
//	    var target_path = "./media/" + driver_id + ".jpg";
//	    var profile_pic = Date.now() + imageobject.name;
//	    
//	    fs.rename(tmp_path, target_path, function(err) {
//	    	
//	        if (err) throw err;
//	        
//	        fs.unlink(tmp_path, function(){
//	        	
//	            if (err){
//	            	
//	                throw err;
//	            }
//	            else{
//	            	
//	                 profile_pic = imageobject.name;
//	                 console.log("INSSIIIDEE ELSE");
//	                 
//	         	
//		             console.log("GOING IN MONGO SAVE FUNCTION");
//		               
//		   			Driver.update({driver_id: driver_id}, {d_image: driver_id} ,{upsert:true},function(err) {
//		   				
//		   				if (err) {
//		   					
//		   					console.log("in mongo save function error saving image");
//		   					response =({status:500,message: "error saving image" });
//		   					callback(null, response);
//		   				}
//		   				else {
//		   			
//		   					console.log("In Mongo save function IN ELSE image saved");
//		   					response = ({status:200,message: "image saved to mongo" });
//		   					callback(null, response);
//		   				}	            			               
//		   			});
//	                 
//	                 
//	                 
//	                 
//	                 callback(null,"image at server saved");
//	            };
//	        });
//	     });
//	}
//	else{
//	
//		profile_pic = "empty.jpeg";
//	}    
//};
//








     

exports.handleRequest=handleRequest;













