
var express = require('express');
var routes = require('./routes');

var admin = require('./routes/admin');
var customer = require('./routes/customer');
var driver = require('./routes/driver');
var ride = require('./routes/ride'); // Prajwal Kondawar
var http = require('http');
var path = require('path');


//var expressSession = require("express-session");
//var mongoStore = require("connect-mongo")(expressSession);

var mongoose = require('mongoose');
var connection = mongoose.connect("mongodb://localhost:27017/uber_db");

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));


//SESSION
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat', duration: 30 * 60 * 1000}));


app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use("/resources", express.static(__dirname + '/resources'));
app.use("/ng-file-upload", express.static(__dirname + '/ng-file-upload'));

if ('development' === app.get('env')) {
	
  app.use(express.errorHandler());
}

app.get('/', routes.index);

//adminModule
app.get('/admin', admin.login);
app.post('/admin', admin.loginAdmin);

app.get('/myProfile', function(req,res){
	res.render("myProfile");
});
app.get('/myTrips', function(req,res){
	res.render("myTrips");
});
app.get('/driverTrips', function(req,res){
	res.render("driverTrips");
});
app.get('/goodBye', function(req,res){
	res.render("goodBye");
});
app.get('/bills', function(req,res){
	res.render("bills");
});


app.get('/getpendingdrivers', admin.getpendingdrivers);
app.get('/getapproveddrivers', admin.getapproveddrivers);
app.post('/approvedriver', admin.approvedriver);
app.post('/deletedriver', admin.deletedriver);

app.get('/getpendingcustomers', admin.getpendingcustomers);
app.get('/getapprovedcustomers', admin.getapprovedcustomers);
app.post('/approvecustomer', admin.approvecustomer);
app.post('/deletecustomer', admin.deletecustomer);

app.post('/admin_driverprofile', admin.admin_driverprofile);
app.get('/admin_driverprofile', admin.admin_todriverprofile);
app.get('/admin_getdriverprofile', admin.admin_getdriverprofile);

app.post('/admin_customerprofile', admin.admin_customerprofile);
app.get('/admin_customerprofile', admin.admin_tocustomerprofile);
app.get('/admin_getcustomerprofile', admin.admin_getcustomerprofile);

app.post('/admin_searchdriver', admin.admin_searchdriver);

app.post('/admin_showrevenuestats', admin.admin_showrevenuestats);
app.post('/admin_rideanalysis', admin.admin_showrideanalysis);

//customerModule
app.get('/loginCustomer',customer.login);
app.post('/loginCustomer',customer.loginCustomer);
app.get('/signupCustomer',customer.signup);
app.post('/signupCustomer',customer.signupCustomer);
app.get('/customer_deleteself', customer.customer_deleteself);
app.get('/customerhome', customer.login);
app.get('/getCustomerDetails', customer.getcustomerdetails);
app.post('/checkCustomerAvailability', customer.checkCustomerAvailability);
app.post('/getUserDetailsByName', customer.getUserDetailsByName);
app.post('/uploadCustImage', customer.uploadCustImage);
app.get('/showDrivers',customer.showDrivers);

app.post('/customer_driverprofile', customer.customer_driverprofile);
app.get('/customer_driverprofile', customer.customer_todriverprofile);
app.get('/customer_getdriverprofile', customer.customer_getdriverprofile);

//drivrModule
app.get('/loginDriver',driver.login);
app.post('/loginDriver',driver.loginDriver);
app.get('/signupDriver',driver.signup);
app.post('/signupDriver',driver.signupDriver);
app.get('/driver_deleteself', driver.driver_deleteself);
app.get('/driverhome', driver.login);
app.get('/getdriverdetails', driver.getdriverdetails);
app.post('/updatedriver', driver.updatedriver);
app.post('/setLocation', driver.driverLocation);


app.post('/imageupload', driver.imageupload);
app.post('/videoupload', driver.videoupload);

// RIDE and BILLLING API - Prajwal Kondawar

app.post('/createRide', ride.createRide);
app.post('/endRide', ride.endRide);
app.post('/deleteRideBill', ride.deleteRideBill);
app.post('/searchBillByAttributes', ride.searchBillByAttributes);
app.get('/customerRideHistory', ride.customerRideHistory);
app.get('/driverRideHistory', ride.driverRideHistory);
app.post('/rideHistory', ride.rideHistory);
app.post('/getCurrentRide',ride.getCurrentRide);
//app.post('/uploadRideImage',ride.rideImageUpload);


//Logout API
app.get('/signout', function(req,res){
	
	req.session.destroy();	
	console.log("Session destroyed");
	//res.end();
	res.render("index");
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



















