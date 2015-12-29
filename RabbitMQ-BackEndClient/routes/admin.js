
var mq_client = require('../rpc/client');

var ejs= require('ejs');




exports.login = function(req,res){
	
	if(req.session.admin_id){
		
		res.render("adminDashboard");
	}
	else{
		
		res.render("loginAdmin");
	}
}
exports.adminMyProfile= function(req,res){
	res.render('myProfile');
}



exports.loginAdmin = function(req,res){
	
	var email = req.param("email");
	var password = req.param("password");
		
	var msg_payload = {"email": email, "password": password, "type": "loginAdmin"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("admin ELSE : " + JSON.stringify(results));
        	
        	if(results.status == 200){
            	
            	console.log("admin ELSE : " + JSON.stringify(results));
            	req.session.admin_id = results.admin_id; 
            	res.status(200).send("success");            	
            }            
            else{
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");             	         	
            }
        }
    });
}
exports.admin_showrevenuestats = function(req, res) {
	console.log("in admin_showrevenuestats....");
//	var msg_payload = { "source_city":"san jose","pickupdate":req.param("pick_up_time") ,"type": "admin_showrevenuestats"};
	var msg_payload = { "source_city":req.param("city"),"pickupdate":req.param("pick_up_time") ,"type": "admin_showrevenuestats"};

    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("revenuestatas"+ results);
        	console.log("revenuestatas"+ JSON.stringify(results));

        	res.end(JSON.stringify(results));
        }
    });
}

exports.admin_showrideanalysis = function(req, res) {
	console.log("in admin_showrideanalysis....");
	var msg_payload = { "type": "admin_showrideanalysis"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("admin_showrideanalysis"+ results);
        	console.log("admin_showrideanalysis"+ JSON.stringify(results));

        	res.end(JSON.stringify(results));
        }
    });
}


exports.getpendingdrivers = function(req,res){
	
		
	var msg_payload = {"type": "getpendingdrivers"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
    	console.log("PENDING DRIVERS FROM SERVER ARE : " + JSON.stringify(results));

        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("Pending Driver retrieved : " + JSON.stringify(results));
        	res.end(JSON.stringify(results));
        }
    });
}


exports.getapproveddrivers = function(req,res){
	
	
	var msg_payload = {"type": "getapproveddrivers"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
    	console.log("APPROVED DRIVERS FROM SERVER ARE : " + JSON.stringify(results));

        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("APPROVED Drivers retrieved in client : " + JSON.stringify(results));
        	res.end(JSON.stringify(results));
        }
    });
}


exports.approvedriver = function(req,res){
	
	
	var msg_payload = {"driver_id": req.param("driver_id"), "type": "approvedriver"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("driver approved");
        	res.end();
        }
    });
}


exports.admin_driverprofile = function(req,res){
	
	req.session.driver_id_profile = req.param("driver_id");
	console.log("session of driver profile : " + req.session.driver_id_profile);
	res.end();
}


exports.admin_todriverprofile = function(req,res){
	
	res.render("admindriverprofile");
}




exports.admin_getdriverprofile = function(req,res){
	
	console.log("in admin_getdriverprofile....");
	
	var msg_payload = {"driver_id": req.session.driver_id_profile, "type": "admin_getdriverprofile"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
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




//
//exports.admin_getdriverprofile = function(req,res){
//	
//	console.log("in admin_getdriverprofile....");
//	
//	var msg_payload = {"driver_id": req.session.driver_id_profile, "type": "admin_getdriverprofile"};
//    
//    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
//        
//        if (err) {
//        	
//            console.log(err);
//            res.send(err);
//        } 
//        else {
//        	
//        	console.log("going to driver profile");
//        	console.log("driver profile from server : " + JSON.stringify(results));
//        	res.end(JSON.stringify(results));
//        }
//    });
//}



exports.deletedriver = function(req,res){
	
	console.log("IN DELETE DRIVER CLIENT");
	
	var msg_payload = {"driver_id": req.param("driver_id"), "type": "deletedriver"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("driver deleted");
        	res.end();
        }
    });
}



exports.getpendingcustomers = function(req,res){
	
	
	var msg_payload = {"type": "getpendingcustomers"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
    	console.log("PENDING CUSTOMERS FROM SERVER ARE : " + JSON.stringify(results));

        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("Pending CUSTOMERS retrieved : " + JSON.stringify(results));
        	res.end(JSON.stringify(results));
        }
    });
}



exports.getapprovedcustomers = function(req,res){
	
	
	var msg_payload = {"type": "getapprovedcustomers"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
    	console.log("CUSTOMERS FROM SERVER ARE : " + JSON.stringify(results));

        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("CUSTOMERS retrieved in client : " + JSON.stringify(results));
        	res.end(JSON.stringify(results));
        }
    });
}


exports.approvecustomer = function(req,res){
	
	
	var msg_payload = {"customer_id": req.param("customer_id"), "type": "approvecustomer"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("customer approved");
        	res.end();
        }
    });
}


exports.admin_customerprofile = function(req,res){
	
	req.session.customer_id_profile = req.param("customer_id");
	console.log("session of customer profile : " + req.session.customer_id_profile);
	res.end();
}


exports.admin_tocustomerprofile = function(req,res){
	
	res.render("admincustomerprofile");
}


exports.admin_getcustomerprofile = function(req,res){
	
	console.log("in admin_getcustomerprofile....");
	
	var msg_payload = {"customer_id": req.session.customer_id_profile, "type": "admin_getcustomerprofile"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("going to customer profile");
        	res.end(JSON.stringify(results));
        }
    });
}



exports.deletecustomer = function(req,res){
	
	console.log("IN DELETE CUSTOMER CLIENT");
	
	var msg_payload = {"customer_id": req.param("customer_id"), "type": "deletecustomer"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("customer deleted");
        	res.end();
        }
    });
}



exports.admin_searchdriver = function(req,res){
	
	console.log("in admin_searchdriver....");
	
	var msg_payload = {"driversearchtext": req.param("driversearchtext"), "driversearchattribute": req.param("driversearchattribute"), "type": "admin_searchdriver"};
    
    mq_client.make_request('admin_queue', msg_payload, function(err,results) {
        
        if (err) {
        	
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	console.log("drivers searched");
        	res.end(JSON.stringify(results));
        }
    });
}






