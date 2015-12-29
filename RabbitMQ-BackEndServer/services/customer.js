var mysql=require('./mysql');
var mongo=require('./mongo/createCustomer');
var mongod=require('./mongo/createDriver');
var Customer = mongo.Customer;
var Driver = mongod.Driver;
var redis = require('./mongo/redis');



function handleRequest(msg,callback){
	switch(msg.type)
	{
		case "signupCustomer":
			signupCustomer(msg,callback);
			break;
		case "loginCustomer":
			loginCustomer(msg,callback);
			break;
		case "getcustomerdetails":
			getcustomerdetails(msg,callback);
			break;
		case "customer_deleteself":
			customer_deleteself(msg,callback);
			break;
		case "checkCustomerAvailability":
			checkCustomerAvailability(msg,callback);
			break;
		case "getUserDetailsByName":
			getUserDetailsByName(msg,callback);
			break;	
		case "imageupload":
			imageupload(msg,callback);
			break;
		case "showDrivers":
			showDrivers(msg,callback);
			break;
		case "updatecustomer":
			updatecustomer(msg,callback);
			break;
		case "customer_getdriverprofile":
			customer_getdriverprofile(msg,callback);
			break;
	}
	return;
}     



function signupCustomer(msg, callback){

	var customer_id = msg.customer_id;
	var email = msg.email;
    var password = msg.password;
    var firstname = msg.firstName;
    var lastname = msg.lastName;
    var address = msg.address;
    var city = msg.city;
    var state = msg.state;
    var zipcode = msg.zipCode;
    var phonenumber = msg.phoneNumber;
    var cc_number = msg.cc_number;
    var cc_name = msg.cc_name;
    var cvv = msg.cvv;
    var month = msg.month;
    var year = msg.year;
    var c_activated = "N";
    var c_available = "Y";
    var c_deleted = "N";
    
    
    var response;
    
    var sqlQuery = "INSERT INTO customer_info (customer_id, c_first_name, c_last_name, c_address, c_city, " +
    				"c_state, c_zipcode, c_phonenumber, c_email, " +
    				"c_password, c_cc_number, c_cc_name, c_cc_mm, c_cc_yyyy, c_cc_cvv, c_activated, c_available, c_deleted) VALUES (" + 
    				"'" + customer_id + "'," +
    				"'" + firstname + "'," +
    				"'" + lastname + "'," +
    				"'" + address+ "'," +
    				"'" + city + "'," +
    				"'" + state + "'," +
    				"'" + zipcode + "'," +
    				"'" + phonenumber + "'," +
    				"'" + email + "'," +
    				"'" + password + "'," +
    				"'" + cc_number + "'," +
    				"'" + cc_name + "'," +
    				"'" + month + "'," +
    				"'" + year + "'," +
    				"'" + cvv + "'," +
    				"'" + c_activated + "'," +
    				"'" + c_available + "'," +    				
    				"'" + c_deleted + "')";
    
    
    mysql.fetchData(function(err,result){
    	
        
    	if(err){ 
    		
    		response =({status:500,message: "Customer! Registeration failed" });
    		console.log("SYSTEM ERROR in customer registration");
    		callback(null,response);
    		
    	}
    	else{											//checking if duplicate customer id exists
    		
    		console.log("CHECKING DUPLICACY FOR CUSTOMER EMAIL");
    		
    		
    		if(result.length > 0){
    			
    			response =({status:300, message: "Customer with this ID already exists" });
    			console.log("CUSTOMER WITH DUPLICATE ID ALREADY EXISTS");
    			callback(null,response);			
    		}
    		else{										//checking for duplicate email ID
    			
    			
    			mysql.fetchData(function(err,result){
    				
    				if(err){ 
    					
    					console.log("SYSTEM ERROR in CUSTOMER REGISTRATION");
    					callback(null,err);
    				}
    				else{
    					
    					console.log("Checking result lenght for customer length");
    					if(result.length > 0){
    						
    						response =({status:300, message: "Customer with this EMAIL already exists" });
    		    			console.log("CUSTOMER DUPLICATE EMAIL EXISTS");
    		    			callback(null,response);	
    					}
    					else{
    						
    						mysql.fetchData(function(err,result){
    		    				
    		    				console.log("IN SECOND FETCHDATA TO INSERTING CUSTOMER");
    		    				if (err) {
    		    					
    		    	                response =({status:500,message: "Customer! Registeration failed" });
    		    	                console.log("IN FETCHDATA TO INSERTION FAILED");
    		    	                callback(null,response);
    		    	            }
    		    	            else {
    		    	            	
    		    	               response = ({status:200,message: "CUSTOMER! Registeration Succesful" });
    		    	               console.log("CUSTOMER INSERTED TO MYSQL");
    		    	               //callback(null, response);
    		    	               
    		    	               
    		    	               
    		    	               console.log("going in mongo save");
    		    	               var createMongoCustomer = new Customer({
    		    	            	   
    		       	    				customer_id: customer_id,
    		       	    				c_email: email,
    		       	    				c_first_name: firstname,
    		       	    				c_last_name: lastname
    		       	            	});

    		       	    			createMongoCustomer.save(function(err) {

    		       	    				if (err) {
    		       	    					throw err;
    		       	    				}
    		       	    				else {
    		       	    					
    		       	    					console.log("saved in mongo");
    		       	    					response = ({status:200, message: "Customer! Registeration Succesful" });
    		       	    					callback(null, response);
    		       	    				}
    		       	    			});
    		    	            }     	
    		    			},sqlQuery);
    					}
    				}
    			}, "select * from customer_info where c_email = '" + email + "'");
    		}
    	}
    }, "select * from customer_info where customer_id = '" + customer_id + "'");    
}


function loginCustomer(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	var sqlQuery = "select * from customer_info where c_email = '" + email +  "' and c_password='" + password +"' and c_deleted != 'Y'";
	
	 mysql.fetchData(function(err,result){
		 
			if(err){ 
				response =({status:500, message: "Customer! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("IN ELSE OF CUSTOMER LOGIN : " + JSON.stringify(result));
				
				if(result.length > 0){
					
					//console.log("CUSTOMER DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));
					//console.log("flag for activation : " + result[0].c_activated);
					
					if(result[0].c_activated == "Y"){
						
						response =({status:200, message: "Customer! Login Successful", customer_id: result[0].customer_id });
						
					}
					else{
						
						response =({status:400, message: "Customer Not Activated"});												
					}
					callback(null,response);
					
				}
				
				else{
					
					response = ({status:500, message: "Customer! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}



function getcustomerdetails(msg,callback){
	
	var customer_id = msg.customer_id;
	
	var response;
	
	var sqlQuery = "select * from customer_info where customer_id = '" + customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve customer details");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("customer details retrieved : " + response);
				Customer.findOne({customer_id:customer_id},'c_image',function(err,image){
						response = {image:image.c_image,info:result};
						callback(null,response);	
				});
				
							
			}
	 },sqlQuery);
}	



function customer_deleteself(msg,callback){
	
	var customer_id = msg.customer_id;
	
	var response;
	
	var sqlQuery = "update customer_info set c_deleted = 'Y' where customer_id = '" + customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not delete customer");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("customer deleted : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	




//#01 - Start -- Prajwal Kondawar

function checkCustomerAvailability(msg, callback){

	var customer_id = msg.customer_id;
    var availability_flag;
    
	var response;
   
    var sqlQuery="SELECT c_available FROM customer_info WHERE customer_id = '" + customer_id + "'";
    console.log("From checkCustomerAvailability API - Select Customer Availability query: " + sqlQuery);
    
    mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "SELECT c_available failed" });
			callback(null,response);
			
		}
		else{
					
			console.log("Selection of c_available succeeded");
			
			if (result[0].c_available === "Y") {
				availability_flag = "Y";
			}
			else{
				availability_flag = "N";
			}
			
			response =({status:200, available_flag: availability_flag, message: "Customer Availability flag" });
			callback(null, response);
			       
		}
		
	},sqlQuery);
    
}


//This (GENERIC) API is useful when you want to perform any activity by Name.
//Since, a particular name can occur multiple times, We need to get all the occurences.
//then clicking on one occurence will do the required operation with that user's unique ID.

function getUserDetailsByName(msg, callback){

	var user_name = msg.user_name;
	var search_type = msg.search_type;
	
	var sqlQuery;
	var response;

	if (search_type === 'C'){ // For Customer
		
		sqlQuery= "SELECT customer_id, c_first_name, c_last_name FROM customer_info WHERE c_first_name = '" + user_name + "'"; 
		
	} else if (search_type === 'D'){ // For Driver
		
		sqlQuery= "SELECT driver_id, d_first_name, d_last_name FROM driver_info WHERE d_first_name = '" + user_name + "'";
		
	} 
	
 
	console.log("From getUserDetailsByName API - Select query: " + sqlQuery);
 
	mysql.fetchData(function(err,result){
		if(err){
			
			response =({status:500,message: "Selection of User Details failed" });
			callback(null,response);
			
		}
		else{
					
			console.log("Selection of User Details suceeded");
			response =({status:200, result: result, message: "User Details Fetched" });
			callback(null, response);
			       
		}
		
	},sqlQuery);
 
}

function imageupload(msg,callback){
	
	
	console.log("SEVER in imageupload function");
	
	var imageobject = msg.imageobject;
	var customer_id = msg.customer_id;
	var c_image = msg.c_image + ".jpg";
	
	
		               
		   			Customer.update({customer_id: customer_id}, {c_image: c_image} ,{upsert:true},function(err) {
		   				
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

function showDrivers(msg,callback){

	redis.getDrivers(msg,function(err,result){
		if(err){
			
			throw err;
		}
		else{
			console.log("Result a gya"+result);
			callback(null,result);
		}
	});
	
}


function customer_getdriverprofile(msg,callback){
	
	var response = [];
	
	var sqlQuery = "select * from driver_info where driver_id = '" + msg.driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve driver profile");
				callback(null,err);
			}
			else{
				
				response[0] = result;
				console.log("DRIVER profile retrieved  : " + response);
				//callback(null,response);
				
				
				Driver.find({driver_id: msg.driver_id}, 'driver_id d_image', function(err, result) {
	   				
   					console.log("FROM MONGOOSE : " + JSON.stringify(result));
   					//console.log("image path should be : " + path(__dirname  + "./" + result[0].d_image));
   					//console.log(__dirname);
   					
   					//console.log("testing : " + path.resolve(__dirname,'..','media',result[0].d_image));
   					//console.log();
   					//callback(null,response);
   					if (err) {
   					
   						console.log("in mongo save function IN IFFFF ERROR");
   						//response =({status:500,message: "image retrieval failed" });
   						callback(err, null);
   					}
   					else {
   				
   						console.log("In Mongo save function IN ELSE SUCCESSFULL RETRIEVAL of image");
   						//response[1] = {"d_image": path.resolve(__dirname,'..','media',result[0].d_image)};
   						response[1] = {"d_image": result[0].d_image};
   						console.log("before " + JSON.stringify(response[1]));
   						callback(null, response);
   					}	            			               
   				});
			}
	 },sqlQuery);
}





exports.handleRequest=handleRequest;





















