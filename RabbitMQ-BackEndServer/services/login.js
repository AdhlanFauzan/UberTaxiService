/*var mongo = require("./mongo");
	var mongoURL = "mongodb://localhost:27017/facebook";
function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	var username=msg.username;
	var password=msg.password;
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('user_details');

		coll.findOne({username: username, password:password}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
//				res.code = "200";
//				res.value = "Succes Login";
				callback(null,user);

			} else {
//				
				res.code = "401";
				res.value = "Failed Login";
				callback(null,res);
			}
		mongo.close();});
	});
	
}
function fetch_data(msg,callback){
	var json_responses = {};
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');
		
		coll.findOne({username: msg.username}, function(err, user){
			if (user) {
				// if data fetched from database
				console.log(user);
				json_responses = {"username" : user.username,"firstname":user.firstname,"lastname":user.lastname};
				console.log(json_responses);
				callback(null,json_responses);

			} else {
				
					json_responses = {"error" : "Encounter Problem while fetching Data"};
					res.send(null,json_responses);}
		});
	});
		
}
function signup(msg,callback){
	var username=msg.username;
	var password=msg.password;
	var firstname=msg.firstname;
	var lastname=msg.lastname;
	var json_responses;
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');

		coll.findOne({username: username}, function(err, user){
			if (user) {
				// Checks Whether User is Already Signed Up
				
				json_responses = {"statusCode" : 401};
				callback(null,json_responses);

			} else {
				coll.insertOne({firstname:firstname,lastname:lastname,username: username, password:password}, function(err, insert){
					if(insert){
					json_responses = {"statusCode" : 200};
					callback(null,json_responses);}
					else{
						throw err;
					}
				});
			}
		});
	});
}
exports.signup=signup;
exports.fetch_data=fetch_data;
exports.handle_request = handle_request;*/