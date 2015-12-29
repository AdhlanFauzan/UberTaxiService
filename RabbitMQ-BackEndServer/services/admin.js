var mysql = require('./mysql');
var mongo = require('./mongo/createDriver');
var fs = require('fs');
var path = require('path');
var Driver = mongo.Driver;


function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "loginAdmin":
			loginAdmin(msg,callback);
			break;			
		case "getpendingdrivers":
			getpendingdrivers(msg,callback);
			break;
		case "getapproveddrivers":
			getapproveddrivers(msg,callback);
			break;
		case "approvedriver":
			approvedriver(msg,callback);
			break;
		case "admin_getdriverprofile":
			admin_getdriverprofile(msg,callback);
			break;
		case "deletedriver":
			deletedriver(msg,callback);
			break;
		case "getpendingcustomers":
			getpendingcustomers(msg,callback);
			break;
		case "getapprovedcustomers":
			getapprovedcustomers(msg,callback);
			break;
		case "approvecustomer":
			approvecustomer(msg,callback);
			break;
		case "admin_getcustomerprofile":
			admin_getcustomerprofile(msg,callback);
			break;
		case "admin_searchdriver":
			admin_searchdriver(msg,callback);
			break;	
		case "deletecustomer":
			deletecustomer(msg,callback);
			break;
		case "admin_showrevenuestats":
			admin_showrevenuestats(msg,callback);
			break;
		case "admin_showrideanalysis":
			admin_showrideanalysis(msg,callback);
			break;
	}
	return;
}


function loginAdmin(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	
	var sqlQuery = "select * from uber_admin where a_email = '" + email + "' and a_password = '" + password + "'";
	
	console.log("data received from client : " + JSON.stringify(msg));
	
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "ADMIN LOGIN ERROR" });
				callback(null,response);
			}
			else{
				
				if(result.length > 0){
					
					response = ({status:200, message: "ADMIN LOGGED IN", admin_id: result[0].admin_id});
					callback(null,response);
				}
				else{
					
					response =({status:500, message: "ADMIN LOGIN FAILED WRONG CREDENTIALS" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}	




function getpendingdrivers(msg,callback){
	
	var response;
	
	var sqlQuery = "select * from driver_info where d_activated = 'N' and d_deleted != 'Y'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve PENDING drivers");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("PENDING DRIVERS RETRIEVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	


function getapproveddrivers(msg,callback){
	
	var response;
	
	var sqlQuery = "select * from driver_info where d_activated = 'Y' and d_deleted != 'Y'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve APPROVED drivers");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("APPROVED DRIVERS RETRIEVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	




function approvecustomer(msg,callback){
	
	var response;
	
	var sqlQuery = "update customer_info set c_activated = 'Y' where customer_id = '" + msg.customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not Approve customer");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("CUSTOMER APPROVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}
     








function approvedriver(msg,callback){
	
	var response;
	
	var sqlQuery = "update driver_info set d_activated = 'Y' where driver_id = '" + msg.driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not Approve driver");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("DRIVER APPROVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}
     


//function admin_getdriverprofile(msg,callback){
//	
//	var response;
//	
//	var sqlQuery = "select * from driver_info where driver_id = '" + msg.driver_id + "'";
//	
//	mysql.fetchData(function(err,result){
//		
//			if(err){ 
//				
//				console.log("Could not retrieve driver profile");
//				callback(null,err);
//			}
//			else{
//				
//				response = JSON.stringify(result);
//				console.log("DRIVER profile retrieved  : " + response);
//				callback(null,response);				
//			}
//	 },sqlQuery);
//}



function admin_getdriverprofile(msg,callback){
	
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





function deletedriver(msg,callback){
	
	console.log("IN DELETE DRIVER SERVER");
	var driver_id = msg.driver_id;
	
	var response;
	
	var sqlQuery = "update driver_info set d_deleted = 'Y' where driver_id = '" + driver_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not DELETE driver");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver DELETED : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	



function getpendingcustomers(msg,callback){
	
	var response;
	
	var sqlQuery = "select * from customer_info where c_activated = 'N' and c_deleted != 'Y'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve PENDING customers");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("PENDING CUSTOMERS RETRIEVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	



function getapprovedcustomers(msg,callback){
	
	var response;
	
	var sqlQuery = "select * from customer_info where c_activated = 'Y' and c_deleted != 'Y'";
						
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve CUSTOMERS");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("CUSTOMERS RETRIEVED  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}	





function admin_getcustomerprofile(msg,callback){
	
	var response;
	
	var sqlQuery = "select * from customer_info where customer_id = '" + msg.customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not retrieve customer profile");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("customer profile retrieved  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}




function deletecustomer(msg,callback){
	
	console.log("IN DELETE CUSTOMER SERVER");
	var customer_id = msg.customer_id;
	
	var response;
	
	var sqlQuery = "update customer_info set c_deleted = 'Y' where customer_id = '" + customer_id + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not delete CUSTOMER ");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("CUSTOMER DELETED : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}


function admin_searchdriver(msg,callback){
	
	var response;	
	var sqlQuery;
	
	
	if(msg.driversearchattribute == "firstname"){sqlQuery = "select * from driver_info where d_first_name = '" + msg.driversearchtext + "'";}
	else if(msg.driversearchattribute == "lastname"){sqlQuery = "select * from driver_info where d_last_name = '" + msg.driversearchtext + "'";}
	else if(msg.driversearchattribute == "city"){sqlQuery = "select * from driver_info where d_city = '" + msg.driversearchtext + "'";}
	
	
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				console.log("Could not search drivers profile");
				callback(null,err);
			}
			else{
				
				response = JSON.stringify(result);
				console.log("driver search result retrieved  : " + response);
				callback(null,response);				
			}
	 },sqlQuery);
}

function admin_showrevenuestats(msg, callback) {
	
	var dateString = msg.pickupdate;
	var area = msg.source_city;
    var sqlQuery= "select * from ride_history where journeydate = str_to_date('"  + dateString + "', '%Y-%m-%d') && source_city = '"  +area+ " ';";
    var response;
    
	mysql.fetchData(function(err,result){
		
		if(err){ 
			
			console.log("Could not search stats ");
			callback(null,err);
		}
		else{
			response = JSON.stringify(result);
			console.log("stats retrieved  : " + response);
			callback(null,response);				
		}
 },sqlQuery);
    
} 

function admin_showrideanalysis(msg, callback) {
	
	
    var sqlQuery= "select * from ride_history;";
    var response;
    
	mysql.fetchData(function(err,result){
		
		if(err){ 
			
			console.log("Could not search stats ");
			callback(null,err);
		}
		else{
			response = JSON.stringify(result);
			console.log("stats retrieved  : " + response);
			callback(null,response);				
		}
 },sqlQuery);
    
}











exports.handleRequest=handleRequest;















