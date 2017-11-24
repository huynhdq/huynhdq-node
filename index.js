var express = require("express");
var app = express();
var random = require("random-js")();
var datetime = require('node-datetime');
app.set("view engine", "ejs");
app.set("views", "./views");
app.use('/libs', express.static(__dirname + '/libs'));
// app.use('/bootstrap', express.static(__dirname + '/bootstrap'));
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
	console.log('Running on port', app.get('port'));
});

app.get("/", function (req, res) {
	console.log("Hi Home");
	// res.render("home.ejs");
	res.render("home.ejs");
});
app.get("/test", function (req, res) {
	console.log("Hi Linh");
	// res.render("home.ejs");
	res.render("for_test.ejs");
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
	idleTimeoutMillis: false,
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

// http://localhost:5000/api?personid=0&timestamp=2017-11-24 12:02:00&heartrate=98&spo2=90
//https://huynhdq-nodejs.herokuapp.com/api?personid=0&timestamp=2017-11-23 03:10:00&heartrate=98&spo2=90
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

app.get('/key_test', function (req, res) {
	var personid = req.param('id');
	var sql_data = "SELECT timestamp, spo2, heartrate FROM PARAMETER_USER WHERE personid = " + personid;
	// console.log(sql_data);
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at KEY: ", err);
		}
		client.query(sql_data, function (err0, response) {
			if (err0) {
				res.end();		//End connect. end load page
				return console.error('Select failed...', err0.stack);
			}
			done();
			var json_str = JSON.stringify(response);
			var json_obj = JSON.parse(json_str);
			// console.log(json_obj.rows)
			res.status(200).send(json_obj.rows)
			// res.end();
		});
	});
});
// localhost:5000/key?id=0
app.get('/key', function (req, res) {
	var personid = req.param('id');
	var sql_data = "SELECT timestamp, spo2, heartrate FROM RANDOM WHERE personid = " + personid;
	// console.log(sql_data);
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at KEY: ", err);
		}
		client.query(sql_data, function (err0, response) {
			if (err0) {
				res.end();		//End connect. end load page
				return console.error('Select failed...', err0.stack);
			}
			done();
			var json_str = JSON.stringify(response);
			var json_obj = JSON.parse(json_str);

			var compareDate_start = new Date(Date.parse("2017-11-21 20:00:00"));
			var compareDate_finish = new Date("2017-11-22 03:00:00");
			var key ={};
			var discription = 'rows';
			key[discription] = [];
			var i = 0;
			for (i = 0; i < json_obj.rows.length; i++) {
				if (new Date(json_obj.rows[i].timestamp) > compareDate_start && new Date(json_obj.rows[i].timestamp) < compareDate_finish) {
					// console.log(json_obj.rows[i].timestamp)
					key[discription].push(json_obj.rows[i]);
				}
				// console.log(json_obj.rows[i].timestamp > compareDate_start);
			}
			while(1){ 
			if(i >= json_obj.rows.length)
			// var json_key = JSON.stringify(key);
			// var json_key_ = JSON.parse(json_key);
			res.setHeader('Content-Type', 'application/json');
			res.status(200).send(key.rows);
			console.log(key)
			break;
			}
			
			// console.log(json_obj.rows)
			// res.status(200).send(json_obj.rows)
			// res.end();
		});
	});
});

//http://localhost:5000/random?start=2017-11-20%2003:10:00&end=2017-11-20%2003:10:30&value=20
app.get('/random', function (req, res) {
	var start = new Date(Date.parse(req.param('start')));
	var end = new Date(Date.parse(req.param('end')));
	// console.log(start.getFullYear());
	// console.log(start.getMonth());
	// console.log(start.getDate());
	// console.log(start.getHours());
	// console.log(start.getMinutes());
	// console.log(start.getSeconds());
	// var numOfValue = function () {
	// if (req.param('value') > ((end.getTime() - start.getTime()) / (1000 * 10)))
	// 		return ((end.getTime() - start.getTime()) / (1000 * 10));
	// 	else
	// 		return req.param('value')
	// }
	// console.log(numOfValue())
	// console.log((end.getTime()-start.getTime())/1000)
	pool.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at Random: ", err);
		}
		else {
			var s1 = 100;
			var s2 = 120;
			var timeInterval = setInterval(function () {
				if (end < start)
					clearInterval(timeInterval);

				start = new Date(start.getTime() + (1000 * 10))
				// var sql_ins = "INSERT INTO RANDOM(personid, timestamp, heartrate, spo2) VALUES(0, "
				// + start + ", " + random.integer(80, 110) + ", " + random.integer(80, 110) + ")";
				s1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
				s2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
				if (s1 > 150)
					s1 = 150;
				else if (s1 < 50)
					s1 = 50;

				if (s2 > 150)
					s2 = 150;
				else if (s2 < 50)
					s2 = 50;

				client.query("INSERT INTO RANDOM(personid, timestamp, heartrate, spo2) VALUES(0, $1, $2, $3)",
					[start, s1, s2],
					function (err0, res0) {
						if (err0) {
							return console.error('Insert failed...', err0.stack);
						}
						console.log('Completed insert');
						done();
					});
			}, 100)
			// 	for (var i = 0; i < numOfValue(); i++) {

			// var timestamp = new Date(start.getTime() + (1000 * 10 * i))
			// 		console.log(timestamp);
			// var timestamp_str = "'" + timestamp.toISOString() + "'";
			// 		// console.log(timestamp.getFullYear());
			// 		// console.log(timestamp.getMonth());
			// 		// console.log(timestamp.getDate());
			// 		// console.log(timestamp.getHours());
			// 		// console.log(timestamp.getMinutes());
			// 		// console.log(timestamp.getSeconds());
			// 		// var spo2 = random.integer(80, 110);
			// 		// var heartrate = random.integer(80, 110);
			// 		var sql_ins = "INSERT INTO RANDOM(personid, timestamp, heartrate, spo2) VALUES(0, " + timestamp_str + ", " + random.integer(80, 110) + ", " + random.integer(80, 110) + ")";

			// 		client.query(sql_ins, function (err0, res0) {
			// 			if (err0) {
			// 				return console.error('Insert failed...', err0.stack);
			// 			}
			// 			console.log('Completed insert');
			// 			done();
			// 		});
			// 	}
			// }
			res.end()
			// var sql_ins = "INSERT INTO PARAMETER_USER(personid, timestamp, heartrate, spo2) VALUES(" + personid + ", " + timestamp + ", " + heartrate + ", " + spo2 + ")";
		}

	});
	function formatDate(date) {
		return ('{0}-{1}-{3} {4}:{5}:{6}').replace('{0}', date.getFullYear()).replace('{1}', date.getMonth() + 1).replace('{3}', date.getDay()).replace('{4}', date.getHours()).replace('{5}', date.getMinutes()).replace('{6}', date.getSeconds())
	}

	function getDateTime() {
		var date = new Date();
		var hour = date.getHours();
		hour = (hour < 10 ? "0" : "") + hour;
		var min = date.getMinutes();
		min = (min < 10 ? "0" : "") + min;
		var sec = date.getSeconds();
		sec = (sec < 10 ? "0" : "") + sec;
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		month = (month < 10 ? "0" : "") + month;
		var day = date.getDate();
		day = (day < 10 ? "0" : "") + day;
		return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
	}
});