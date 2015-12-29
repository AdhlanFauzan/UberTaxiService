
var mq_client = require('../rpc/client');
var ejs = require('ejs');
var fs = require('fs');

function signup(req,res){
	
	if(req.session.driver_id){
		
		res.render("driverDashboard");
	}
	else{
		
		res.render("signupDriver");
	}
}


function login(req,res){
	
	if(req.session.driver_id){
		
		res.render("driverDashboard");
	}
	else{
		
		res.render("loginDriver");
	}
}


function loginDriver(req,res){
	var fieldState = {email: 'VALID', password: 'VALID'};
	var email = req.param('email');
    var password = req.param('password');
    
    var msg_payload = {"email": email, "password" : password, "type": "loginDriver"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	console.log("IN IF OF DRIVER LOGIN");
            	req.session.driver_id = results.result.driver_id;
            	req.session.d_first_name =results.result.d_first_name;
            	req.session.d_last_name=results.result.d_last_name;
            	console.log(results.result);
            	res.status(200).send("success");
            	
            }            
            else{
            	
            	console.log("IN ELSE OF DRIVER LOGIN");
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");           	         	
            }
        }
    });
}


function signupDriver(req,res){
	
	var driver_id= req.param('driver_id');
	var email = req.param('d_email');
    var password = req.param('d_password');
    var firstName = req.param('first_name');
    var lastName = req.param('last_name');
    var address = req.param('address');
    var city = req.param('city');
    var state = req.param('state');
    var zipCode = req.param('zipCode');
    var phoneNumber = req.param('mobile');
    var d_car_number = req.param('car_number');
    var d_car_name = req.param('car_name');
    var response;
    
    var driver_id_validate = /^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/;
    var car_number_validate = /^[0-9][a-z]{3}[0-9]{3}$/;
    var email_validate = /\S+@\S+\.\S+/;
    var zipCode_validate = new RegExp("^\\d{5}(-\\d{4})?$");
    
    
    if(!driver_id_validate.test(driver_id)){
    	
    	console.log("in IF. invalid SSN");
    	res.end("invalid driver_id");
    	return;
    }
    
//    if(!car_number_validate.test(d_car_number)){
//    	
//    	console.log("In IF invalid registration number");
//    	res.end("In IF invalid registration number");
//    	return;     	
//    }
    
//    if(!email_validate.test(email)){
//    	
//    	console.log("In IF invalid EMAIL");
//    	res.end("In IF invalid EMAIL");
//    	return;    	
//    }
//    
//    if(!zipCode_validate.test(zipCode)){
//    	
//    	console.log("In IF invalid ZIPCODE");
//    	res.end("In IF invalid ZIPCODE");
//    	return;    	
//    }
//    
//    if(phoneNumber.toString().length != 10){
//    	
//    	console.log("In IF invalid PHONE");
//    	res.end("In IF invalid PHONE");
//    	return;     	
//    }
    
    console.log("request object :" + req);
    
    var msg_payload = {
    		
    	"driver_id":driver_id,
        "email" : email,	
        "password" : password,
        "firstName" : firstName,
        "lastName" : lastName,
        "address" : address,
        "city" : city,
        "state" : state,
        "zipCode" : zipCode,
        "phoneNumber" : phoneNumber,
        "d_car_number" : d_car_number,
        "d_car_name" : d_car_name,
        "type":"signupDriver"      
    };
    
    console.log("sending msg payload for driver signup : " + JSON.stringify(msg_payload));

    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
    	
        
        if (err) {
        	
            console.log(err);           
        } 
        else{
        	
        	if(results.status == 200){
        	
        		console.log("in ELSE of driver signup about results" + JSON.stringify(results));
        		console.log("successful login");
        		res.render('loginDriver');
        	}
        	else{
        		
        		res.send(JSON.stringify(results));
        	}
        }
    });
}


exports.getdriverdetails = function(req,res){
	
	
	var msg_payload = {"driver_id": req.session.driver_id, "type": "getdriverdetails"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("Driver details" + JSON.stringify(results));            
            res.end(JSON.stringify(results));
        }
    });
}



exports.updatedriver = function(req,res){
	
	var email = req.param('d_email');
	var password = req.param('d_password');
    var firstName = req.param('d_first_name');
    var lastName = req.param('d_last_name');
    var address = req.param('d_address');
    var city = req.param('d_city');
    var state = req.param('d_state');
    var zipCode = req.param('d_zipcode');
    var phoneNumber = req.param('d_phonenumber');
    var d_car_number = req.param('d_car_number');
    var d_car_name = req.param('d_car_name');
	
	
	 var msg_payload = {
	    		
		    	"driver_id":req.session.driver_id,
		    	"email": email,
		        "password" : password,
		        "firstName" : firstName,
		        "lastName" : lastName,
		        "address" : address,
		        "city" : city,
		        "state" : state,
		        "zipCode" : zipCode,
		        "phoneNumber" : phoneNumber,
		        "d_car_number" : d_car_number,
		        "d_car_name" : d_car_name,
		        "type":"updatedriver"      
		    };
	
	 console.log("data recieved for update : " + msg_payload);
	
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("Driver updated" + JSON.stringify(results));  
            res.end();
        }
    });
}

exports.imageupload = function(req,res){
	
	console.log("CLIENT : in imageupload function");
	
	
	if(req.files.pt_file.size != 0){
		
	    var tmp_path = req.files.pt_file.path;
	    
	    var target_path = "./public/media/" + req.session.driver_id + ".jpg";
	    var profile_pic = req.session.driver_id;
	    
	    fs.rename(tmp_path, target_path, function(err) {
	    	
	        if (err) throw err;
	        
	        fs.unlink(tmp_path, function(){
	        	
	            if (err) {
	            	
	                throw err;
	            }
	            else{
	                    profile_pic = req.files.pt_file.name;
	            };
	        });
	     });
	}
	else{
	
		profile_pic = "empty.jpg";
	}
	
  
	var msg_payload = {"driver_id": req.session.driver_id, "d_image" : req.session.driver_id, "type": "imageupload"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("image uploaded" + JSON.stringify(results));  
            res.end();
            
        }
    });
};

//* Parveen
exports.videoupload = function(req,res){
	
	console.log("CLIENT : in videoupload function");
	
	
	if(req.files.movie.size != 0){
		
	    var tmp_path = req.files.movie.path;
	    
	    var target_path = "./public/media/" + req.session.driver_id + ".mp4";
	    var profile_video = req.session.driver_id;
	    
	    fs.rename(tmp_path, target_path, function(err) {
	    	
	        if (err) throw err;
	        
	        fs.unlink(tmp_path, function(){
	        	
	            if (err) {
	            	
	                throw err;
	            }
	            else{
	                    profile_video = req.files.movie.name;
	            };
	        });
	     });
	}
	else{
	
		profile_video = "empty.mp4";
	}
	
  
	var msg_payload = {"driver_id": req.session.driver_id, "d_video" : req.session.driver_id, "type": "videoupload"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("video uploaded" + JSON.stringify(results));  
            res.end();
            
        }
    });
};

//var fs = require("fs"),
//http = require("http"),
//url = require("url"),
//path = require("path");
//
//exports.getVideo = function (req, res) {
//if (req.url !== "/movie.mp4") {
//	res.writeHead(200, { "Content-Type": "text/html" });
//	res.end('<video src="http://localhost:3000/movie.mp4" controls></video>');
//	} else {
//	var file = path.resolve(__dirname,"../public/movie.mp4");
//	var range = req.headers.range;
//	var positions = range.replace(/bytes=/, "").split("-");
//	var start = parseInt(positions[0], 10);
//
//	fs.stat(file, function(err, stats) {
//	  var total = stats.size;
//	  var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
//	  var chunksize = (end - start) + 1;
//
//	  res.writeHead(206, {
//	    "Content-Range": "bytes " + start + "-" + end + "/" + total,
//	    "Accept-Ranges": "bytes",
//	    "Content-Length": chunksize,
//	    "Content-Type": "video/mp4"
//	  });
//
//	  var stream = fs.createReadStream(file, { start: start, end: end })
//	    .on("open", function() {
//	      stream.pipe(res);
//	    }).on("error", function(err) {
//	      res.end(err);
//	    });
//	});
//}
//};



//exports.imageupload = function(req,res){
//	
//	console.log("CLIENT : in imageupload function");
//	
//	var msg_payload = {"driver_id": req.session.driver_id, "imageobject" : req.files.pt_file, "type": "imageupload"};
//    
//    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
//        
//        if (err) {
//            console.log(err);
//            res.send(err);
//        } 
//        else {
//        	
//            console.log("image uploaded" + JSON.stringify(results));  
//            res.end();
//            
//        }
//    });
//};




exports.driver_deleteself = function(req,res){
	
	
	var msg_payload = {"driver_id": req.session.driver_id, "type": "driver_deleteself"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            console.log("Driver deleted" + JSON.stringify(results));  
            req.session.destroy();
            res.end();
        }
    });
}

exports.driverLocation = function(req,res){
	var driverLat = req.param('driverLat');
	var driverLong = req.param('driverLong');
	console.log(req.session.driver_id);
	var msg_payload = {"driver_id": req.session.driver_id,"driverLat": driverLat,"driverLong": driverLong,"d_first_name":req.session.d_first_name,"d_last_name":req.session.d_last_name, "type": "driverLocation"};
    
    mq_client.make_request('driver_queue', msg_payload, function(err,results) {
        
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	console.log(results);
        	res.send(results);
        }
    });
}





exports.login = login;
exports.loginDriver = loginDriver;
exports.signupDriver = signupDriver;
exports.signup = signup;