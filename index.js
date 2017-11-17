var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use('/lib_chart', express.static(__dirname + '/lib_chart'));
app.use('/bootstrap', express.static(__dirname + '/bootstrap'));
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
	console.log('Running on port', app.get('port'));
});

app.get("/", function (req, res) {
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

app.get("/showlist", function (req, result) {
	console.log("hi start");
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db", err);
		}
		client.query('SELECT "LOGINS"."id", "PARAMETER"."id", "LOGINS"."username", "PARAMETER"."heartRate", "PARAMETER"."spo2" FROM "LOGINS", "PARAMETER" WHERE "LOGINS"."id" = "PARAMETER"."id"', function (err, res) {
			// client.query('SELECT "PARAMETER_USER"."Personid", "INFO_USER"."id", "PARAMETER_USER"."tiemstamp", "INFO_USER"."username", "PARAMETER_USER"."heartRate", "PARAMETER_USER"."spo2" FROM "INFO_USER", "PARAMETER_USER" WHERE "INFO_USER"."personid" = "PARAMETER_USER"."personid"', function(err, res) {
			// client.query('SELECT "id", "username" FROM "LOGINS"', function(err, res) {		
			done();
			if (err) {
				// res.end();		//End connect. end load page
				return console.error(err.stack);
			}
			console.log(res.rows[0]);
			// result.render("showdb.ejs");
			result.render("showdb.ejs", { userlist: res })
		});
	});
})

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//show form add info
app.get("/add", function (req, res) {
	res.render("addUser.ejs");
});
var loginTable = '"LOGINS"';
var parameterTable = '"PARAMETER"';
//#region 
//insert database
app.post("/add", urlencodedParser, function (req, res) {
	pool.connect(process.env.DATABASE_URL, function (err, client, done) {
		if (err) {
			return console.log('error client from pool', err);
		}
		var user = req.body.txtUser;
		var pass = req.body.txtPass;
		console.log('Giá trị username: ' + user);
		res.end();
		// if (err) throw err
		// var value = req.body;
		// value.push()
		// client.query("INSERT INTO "+ loginTable +" (username, password) VALUES ('" + user + "', '" + pass + "')", function(err, result) {

		// client.query('INSERT INTO "LOGINS"("username", "password") VALUES (user, pass)', function(err, result) {
		// client.query("INSERT INTO LOGINS(username, password) VALUES ('" + user + "', '" + pass + "')", function(err, result) {
		// client.query("INSERT INTO LOGINS(username, password) VALUES('"+username+"', '"+password+"')", function(err, result) {
		// done();

		// if (err) {
		// res.end();
		// return console.error('error running query', err);
		// }

		// console.log("má insert hoài không được");
		// result.render("showdb.ejs", {userlist:res})
		// res.render("showdb.ejs")
		// result.render("showdb.ejs")		
		// res.send("Completed new User");	
		// res.redirect("/showdb");
		// });
	});

	// res.send("Completed new User")
});

// console.log(data.toString());
//#endregion

// http://localhost:5000/api?personid=2&timestamp=10-15-2017-16:12:00&heartrate=98&spo2=90
// https://huynhdq-nodejs.herokuapp.com/api?personid=2&timestamp=10-30-2017-03-10-00&heartrate=98&spo2=90
app.get('/api', function (req, res) {
	var personid = req.param('personid');
	var timestamp = "'" + req.param('timestamp') + "'";	//10-15-2017-16-12-00

	var heartrate = req.param('heartrate');
	var spo2 = req.param('spo2');
	res.send(personid + ' ' + timestamp + ' ' + spo2 + ' ' + heartrate);
	var sql_sel = "SELECT * FROM INFO_USER WHERE personid = " + personid;
	var sql_ins = "INSERT INTO PARAMETER_USER(personid, timestamp, heartrate, spo2) VALUES(" + personid + ", " + timestamp + ", " + heartrate + ", " + spo2 + ")";
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at API: ", err);
		}
		client.query(sql_sel, function (err, res) {
			if (res.rows[0] != null) {
				// console.log(res.rows[0]);
				client.query(sql_ins, function (err0, res0) {
					if (err0) {
						// res.end();		//End connect. end load page
						return console.error('Insert failed...', err0.stack);
					}
					console.log('Completed insert');
					done();
				});
			}
			else
				console.log('null')
		});
	});
});
// localhost:5000/key?id=0
app.get('/key', function (req, res) {
	var personid = req.param('id');
	var sql_data = "SELECT timestamp, spo2 FROM PARAMETER_USER WHERE personid = " + personid;
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at KEY: ", err);
		}
		client.query(sql_data, function (err0, response) {
			if (err0) {
				res.end();		//End connect. end load page
				return console.error('Insert failed...', err0.stack);
			}
			done();
			var json_str = JSON.stringify(response);
			var json_obj = JSON.parse(json_str);
			console.log(json_obj.rows)
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(json_obj.rows)
		});
	});
});