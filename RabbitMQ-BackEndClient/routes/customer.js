
var mq_client = require('../rpc/client');
var ejs= require('ejs');
var fs = require('fs');

function signup(req,res){
	
	if(req.session.customer_id){
		
		res.render("customerHome");
	}
	else{
		
		res.render("signupCustomer");
	}

}

function login(req,res){
	
	if(req.session.customer_id){
		
		res.render("customerHome");
	}
	else{
		
		res.render("loginCustomer");
	}
}


function loginCustomer(req,res){
	
	var email = req.param('email');
    var password = req.param('password');
    var msg_payload = {"email": email, "password" : password, "type": "loginCustomer"};
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	        
    	if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	req.session.customer_id = results.customer_id; 
            	res.status(200).send("success");
            }
            else {
            	
            	res.status(404).send("Invalid User Name & Password! Please try again");
            }
        }
    });
}


function signupCustomer(req,res){
	
	var customer_id = req.param('customer_id');
	var email = req.param('email');
    var password = req.param('password');
    var firstName = req.param('first_name');
    var lastName = req.param('last_name');
    var address = req.param('address');
    var city = req.param('city');
    var state = req.param('state');
    var zipCode = req.param('zipCode');
    var phoneNumber = req.param('mobile');
    var cc_number = req.param('cc_number');
    var cc_name = req.param('cc_name');
    var cvv = req.param('cvv');
    var month = req.param('month');
    var year = req.param('year');

    var customer_id_validate = /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/;
    var email_validate = /\S+@\S+\.\S+/;
    //var zipCode_validate = new RegExp("^\\d{5}(-\\d{4})?$");
    
    
//    if(!customer_id_validate.test(customer_id)){
//    	
//    	console.log("in IF. invalid SSN");
//    	res.end("invalid customer_id");
//    	return;
//    }
//    
    
    if(!email_validate.test(email)){
    	
    	console.log("In IF invalid EMAIL");
    	res.end("In IF invalid EMAIL");
    	return;    	
    }
    
    
//    if(!zipCode_validate.test(zipCode)){
//    	
//    	console.log("In IF invalid ZIPCODE");
//    	res.end("In IF invalid ZIPCODE");
//    	return;    	
//    }
        
    if(phoneNumber.toString().length != 10){
    	
    	console.log("In IF invalid PHONE");
    	res.end("In IF invalid PHONE");      
    	return;     	
    }
    
//    if(cc_number.toString().length > 15 && cc_number.toString().length < 20){
//    	
//    	console.log("In IF invalid Card Number");
//    	res.end("In IF invalid card number");
//    	return;     	
//    }
    
        
    var msg_payload = {
    	"customer_id":customer_id,
        "email" : email,	
        "password" : password,
        "firstName" : firstName,
        "lastName" : lastName,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode,
        "phoneNumber" : phoneNumber,
        "cc_number" : cc_number,
        "cc_name" : cc_name,
        "cvv" : cvv,
        "month" : month,
        "year" : year,        
        "type": "signupCustomer"
    };

    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	if(results.status == 200){
        		
        		console.log("about results" + results);
        		res.render('loginCustomer');
        	}
        	else{
        		
        		res.send(JSON.stringify(results));
        	}
        }
    });
}


exports.getcustomerdetails = function(req,res){
	
    var msg_payload = {"customer_id": req.session.customer_id, "type": "getcustomerdetails"};
        				
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	        
    	if (err) {
    		
            console.log("could get customer details " + err);
            res.send(err);
        } 
        else {
        	
        	console.log("customer records fetched " + JSON.stringify(results));
        	res.status(200).send(results);
        }        
    });
	
}



exports.customer_deleteself = function(req,res){
		
    var msg_payload = {"customer_id": req.session.customer_id, "type": "customer_deleteself"};
        				
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	        
    	if (err) {
    		
            console.log("could not delete customer self " + err);
            res.send(err);
        } 
        else {
        	
        	console.log("customer deleted self" + JSON.stringify(results));
        	req.session.destroy();	
        	res.status(200).send("success"); 
        }        
    });
}



//#01 - Start -- Prajwal Kondawar

function checkCustomerAvailability (req,res){
	
	var msg_payload = {
  	"customer_id": req.session.customer_id,
      "type": "checkCustomerAvailability"
  };

  mq_client.make_request('customer_queue', msg_payload, function(err,results) {
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

function getUserDetailsByName (req,res){
	
	var user_name = req.param('user_name');
	var search_type = req.param('search_type');
	
	var msg_payload = {
  	"user_name": user_name,
  	"search_type": search_type,
      "type": "getUserDetailsByName"
  };

  mq_client.make_request('customer_queue', msg_payload, function(err,results) {
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
exports.uploadCustImage = function(req,res){
	
	console.log("CLIENT : in imageupload function");
	
	
	if(req.files.picture.size != 0){
		
	    var tmp_path = req.files.picture.path;
	    
	    var target_path = "./public/media/" + req.session.customer_id + ".jpg";
	    var profile_pic = req.session.customer_id;
	    
	    fs.rename(tmp_path, target_path, function(err) {
	    	
	        if (err) throw err;
	        
	        fs.unlink(tmp_path, function(){
	        	
	            if (err) {
	            	
	                throw err;
	            }
	            else{
	                    profile_pic = req.files.picture.name;
	            };
	        });
	     });
	}
	else{
	
		profile_pic = "empty.jpg";
	}
	
  
	var msg_payload = {"customer_id": req.session.customer_id, "c_image" : req.session.customer_id, "type": "imageupload"};
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("image uploaded" + JSON.stringify(results));  
            res.send("success");
            
        }
    });
};
function showDrivers (req,res){
	
	
	
	var msg_payload = {
  	
      "type": "showDrivers"
  };

  mq_client.make_request('customer_queue', msg_payload, function(err,results) {
      
      if (err) {
          console.log(err);
          res.statu(404).send(JSON.stringify(results));
      } else {
          console.log("about results" + results);
          console.log(JSON.stringify(results));
          res.status(200).send(JSON.stringify(results));
          
      }
  });
}

exports.customer_driverprofile = function(req,res){
	
	req.session.customer_driver_id_profile = req.param("driver_id");
	console.log("session of driver profile : " + req.session.customer_driver_id_profile);
	res.end();
}


exports.customer_todriverprofile = function(req,res){
	
	res.render("customerdriverprofile");
}




exports.customer_getdriverprofile = function(req,res){
	
	console.log("in customer_getdriverprofile....");
	console.log(req.session.customer_driver_id_profile);
	var msg_payload = {"driver_id": req.session.customer_driver_id_profile, "type": "customer_getdriverprofile"};
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("going to driver profile");
        	console.log("driver profile from server : " + JSON.stringify(results));
        	res.end(JSON.stringify(results));
        }
    });
}

exports.showDrivers=showDrivers;
exports.login=login;
exports.loginCustomer=loginCustomer;
exports.signupCustomer=signupCustomer;
exports.signup=signup;
exports.checkCustomerAvailability=checkCustomerAvailability; //#01
exports.getUserDetailsByName=getUserDetailsByName; // #01