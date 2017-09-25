var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function(){
	console.log('Running on port', app.get('port'));
});

app.get("/", function(req, res){
	console.log("Hi Home");
	res.render("home.ejs");
});

var pg = require('pg')
// var conString = process.env.DATABASE_URL || "postgres://cttdpggjrnxutx:f37de5e367a988b9e28fe1b46c5b6af98a7d1610fb34d6c3fb631361d2866a02@ec2-54-163-254-76.compute-1.amazonaws.com:5432/d1r7dujctnsvp8";
// var pool = new pg.Pool(conString);
var pool = new pg.Pool({
	user: 'cttdpggjrnxutx', //cttdpggjrnxutx
	host: 'ec2-54-163-254-76.compute-1.amazonaws.com', //ec2-54-163-254-76.compute-1.amazonaws.com
	database: 'd1r7dujctnsvp8', //d1r7dujctnsvp8
	password: 'f37de5e367a988b9e28fe1b46c5b6af98a7d1610fb34d6c3fb631361d2866a02', //f37de5e367a988b9e28fe1b46c5b6af98a7d1610fb34d6c3fb631361d2866a02
	port: 5432,
	ssl: true
});

//---------------------------#test connect database
// pool.query('SELECT "LOGINS"."id", "PARAMETER"."id", "LOGINS"."username", "PARAMETER"."heartRate", "PARAMETER"."spo2" FROM "LOGINS", "PARAMETER" WHERE "LOGINS"."id" = "PARAMETER"."id"', function(err, res){
// pool.query('SELECT "id", "username" FROM "LOGINS"', function(err, res){
		// console.log(res);
		// console.log(err);
		// pool.end()
// });

app.get("/showdb", function(req, result){
	console.log("hi start");
	pool.connect(function(err, client, done){
		if(err){
			return console.error("error connect db", err);
		}
		client.query('SELECT "LOGINS"."id", "PARAMETER"."id", "LOGINS"."username", "PARAMETER"."heartRate", "PARAMETER"."spo2" FROM "LOGINS", "PARAMETER" WHERE "LOGINS"."id" = "PARAMETER"."id"', function(err, res) {
		// client.query('SELECT "id", "username" FROM "LOGINS"', function(err, res) {		
			done();
			if (err) {
				res.end();		//End connect. end load page
				return console.error(err.stack);
			}
			console.log(res.rows[0]);
			// result.render("showdb.ejs");
			result.render("showdb.ejs", {userlist:res})
		});
	});
})

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//show form add info
app.get("/add", function(req, res){
	res.render("addUser.ejs");
});
var loginTable = '"LOGINS"';
var parameterTable = '"PARAMETER"';

//insert database
app.post("/add",urlencodedParser, function(req, res){
	
	pool.connect(function(err, client, done) {
		if(err){
			return console.log('error client from pool', err);
		}
		var user = req.body.txtUser;
		var pass = req.body.txtPass;
		// var spo2 = req.body.txtSPO2;
		// var heartRate = req.body.txtHeartRate;
		
		console.log('Giá trị username: '+ user);
		
		client.query("INSERT INTO "+ loginTable +" (username, password, ) VALUES ('" + user + "', '" + pass + "')", function(err, result) {
		// client.query('INSERT INTO "LOGINS"("username", "password") VALUES (user, pass)', function(err, result) {
		// client.query("INSERT INTO LOGINS(username, password) VALUES ('" + user + "', '" + pass + "')", function(err, result) {
		// client.query("INSERT INTO LOGINS(username, password) VALUES('"+username+"', '"+password+"')", function(err, result) {
			done();

			if (err) {
				res.end();
				return console.error('error running query', err);
			}

			console.log("má insert hoài không được");
						// result.render("showdb.ejs", {userlist:res})
						// res.render("showdb.ejs")
						// result.render("showdb.ejs")		
						// res.send("Completed new User");	
						res.redirect("/showdb");
		});
		// client.query("INSERT INTO "+ parameterTable +" (spo2, heartRate, ) VALUES ('" + spo2 + "', '" + heartRate + "')", function(err, result) {

		
	});

	// res.send("Completed new User")
});
