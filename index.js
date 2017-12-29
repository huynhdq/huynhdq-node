// import { render } from "../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/ejs";

//----------- SAVE ----------
// function formatDate(date) {
// 	return ('{0}-{1}-{3} {4}:{5}:{6}').replace('{0}', date.getFullYear()).replace('{1}', date.getMonth() + 1).replace('{3}', date.getDay()).replace('{4}', date.getHours()).replace('{5}', date.getMinutes()).replace('{6}', date.getSeconds())
// }

// function getDateTime() {
// var date = new Date();
// 	var hour = date.getHours();
// 	hour = (hour < 10 ? "0" : "") + hour;
// 	var min = date.getMinutes();
// 	min = (min < 10 ? "0" : "") + min;
// 	var sec = date.getSeconds();
// 	sec = (sec < 10 ? "0" : "") + sec;
// 	var year = date.getFullYear();
// 	var month = date.getMonth() + 1;
// 	month = (month < 10 ? "0" : "") + month;
// 	var day = date.getDate();
// 	day = (day < 10 ? "0" : "") + day;
// 	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
// }

//----------------------------------------------------------------------------
// var bodyParser = require('body-parser');
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// //show form add info
// app.get("/add", function (req, res) {
// 	res.render("addUser.ejs");
// });
// var loginTable = '"LOGINS"';
// var parameterTable = '"PARAMETER"';
// //#region 
// //insert database
// app.post("/add", urlencodedParser, function (req, res) {
// 	con.connect(process.env.DATABASE_URL, function (err, client, done) {
// 		if (err) {
// 			return console.log('error client from con', err);
// 		}
// 		var user = req.body.txtUser;
// 		var pass = req.body.txtPass;
// 		console.log('Giá trị username: ' + user);
// 		res.end();
// 		// if (err) throw err
// 		// var value = req.body;
// 		// value.push()
// 		// client.query("INSERT INTO "+ loginTable +" (username, password) VALUES ('" + user + "', '" + pass + "')", function(err, result) {

// 		// client.query('INSERT INTO "LOGINS"("username", "password") VALUES (user, pass)', function(err, result) {
// 		// client.query("INSERT INTO LOGINS(username, password) VALUES ('" + user + "', '" + pass + "')", function(err, result) {
// 		// client.query("INSERT INTO LOGINS(username, password) VALUES('"+username+"', '"+password+"')", function(err, result) {
// 		// done();

// 		// if (err) {
// 		// res.end();
// 		// return console.error('error running query', err);
// 		// }

// 		// console.log("má insert hoài không được");
// 		// result.render("showdb.ejs", {userlist:res})
// 		// res.render("showdb.ejs")
// 		// result.render("showdb.ejs")		
// 		// res.send("Completed new User");	
// 		// res.redirect("/showdb");
// 		// });
// 	});

// 	// res.send("Completed new User")
// });

// console.log(data.toString());
//-----------------------------------------------------------------
var express = require("express");
var cookieParser = require('cookie-parser'); 
var app = express();
var random = require("random-js")();
var datetime = require('node-datetime');
app.set("view engine", "ejs");
app.set("views", "./views");
app.use('/libs', express.static(__dirname + '/libs'));
app.set('port', (process.env.PORT || 80));


app.listen(app.get('port'), function () {
	console.log('Running on port', app.get('port'));
});

var mysql = require('mysql');
var con = mysql.createConnection({
	host: "35.187.242.233",
	user: "aaa",
	password: "de6uzuqym",
	database: "namhoang_aaa"
});
//Home
app.get("/", function (req, res) {
	console.log("Hi Home");
	res.render("home.ejs");
});
app.get("/detail", function (req, res) {
	res.render("detail.ejs");
});
//Create random DB for chart
// app.get("/", function (req, res) {
// 	con.connect(function (err) {

// 		if (err) throw err;
// 		console.log("Connected!");
// 		for (var i = 2; i < 100000; i++) {
// 			var sql = "Insert Into USER(id) VALUES(" + i + ")";
// 			con.query(sql, function (err, result) {
// 				if (err) throw err
// 				console.log("err...");
// 				console.log("Result: " + result);
// 			});
// 		}
// 	});
// });

//http://localhost:5000/randomDB?start=2018-01-01 00:00:00&end=2018-01-08 00:00:00
app.get('/randomDB', function (req, res) {
	var start = new Date(Date.parse(req.param('start')));
	var end = new Date(Date.parse(req.param('end')));
	start = start.getTime();
	end = end.getTime();
	// con.connect(function (err, client, done) {
	// 	if (err) {
	// 		return console.error("error connect db at Random: ", err);
	// 	}
	// 	else {
	var s1 = 100;
	var s2 = 120;
	var timeInterval = setInterval(function () {
		if (end < start)
			clearInterval(timeInterval);
		// start = new Date(start.getTime() + (1000 * 10))
		start += (1000 * 10);
		// console.log(start)
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
		var sql_ins_random = "INSERT INTO `RANDOM_DB`(`ID`, `TIMESTAMP`, `HEARTRATE`, `SPO2`) VALUES ('0', " + start + ", " + s1 + ", " + s2 + ")";
		con.query(sql_ins_random, function (err0, rows, fields) {
			if (err0) {
				return console.error('Insert failed.......................', err0.stack);
			}
			console.log('Completed insert');
		});
	}, 100);
	res.end();
});

//------------- Get DB for chart ----------------
// localhost:5000/getdb?id=0
app.get('/getdb', function (req, res) {
	// console.log(34324)
	var token =  req.param('token');	
	console.log("token" + token)
	con.query("select ID from USER_DB WHERE TOKEN = '" + token + "'", function (err0, response) {
		if (err0) {
			return console.error('Select getdb is failed...', err0.stack);
			res.end();		//End connect. end load page			
		}
		console.log("ee" + response.length);
		if(response.length > 0){ // Kiem tra rong
			var ID = req.param('id');
			var compareDate_start = req.param('timestart');
			var compareDate_finish = req.param('timeend');
			// console.log(34324)
			// console.log("f:" + compareDate_finish)
			if (compareDate_finish == undefined || compareDate_finish == "")
				compareDate_finish = new Date("2018-01-01 03:00:00");
			else
				compareDate_finish = new Date(compareDate_finish);
			if (compareDate_start == undefined || compareDate_start == "")
				compareDate_start = new Date('2018-01-01 00:00:00');
			else
				compareDate_start = new Date(compareDate_start);
				// console.log(compareDate_start.getTime());
			var sql_data = "SELECT `DATETIME`, `HEARTRATE`, `SPO2` FROM RANDOM_DB WHERE `ID` = " + ID;
			sql_data += " and `TIMESTAMP` >= " + compareDate_start.getTime() + " and `TIMESTAMP` <= " + compareDate_finish.getTime();
			console.log(sql_data);
			con.query(sql_data, function (err0, response) {
				if (err0) {
					return console.error('Select failed...', err0.stack);
					res.end();		//End connect. end load page
				}
				var json_str = JSON.stringify(response);
				var json_obj = JSON.parse(json_str);
				res.status(200).send(json_obj);
			});
		} else{ res.status(200).send(false);
		}
	}
);
});



function updateUser(userId, token){
	con.query("Update USER_DB set TOKEN = "+token+" WHERE ID = " + userId, function (err0, response) {
		if (err0) {
			return console.error('Update failed...', err0.stack);
			res.end();		//End connect. end load page			
		}
	})
}

app.get("/login", function(req, result){
	var userName = req.param('username');
	var password = req.param('password');
	
	con.query("select ID, USERNAME from USER_DB WHERE USERNAME = '" + userName + "' and PASSWORD = '" + password + "'", function (err0, response) {
		if (err0) {
			return console.error('Select failed...', err0.stack);
			res.end();		//End connect. end load page			
		}	

		if(response.length > 0){
			var token = 435;
			var json_str = JSON.stringify(response);
		
			var json_obj = JSON.parse(json_str);
			updateUser(json_obj[0].ID, token);
			json_obj[0].Token = token;
			// result.cookie("fullname", json_obj[0].USERNAME);
			result.status(200).send(json_obj[0]);
		} else {
			result.status(200).send(false);
		}
	})
})


app.get("/showlist", function (req, result) {
	console.log("hi start");
	con.connect(function (err, client, done) {
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

// http://localhost:5000/api?personid=0&timestamp=2017-11-24 12:02:00&heartrate=98&spo2=90
//https://huynhdq-nodejs.herokuapp.com/api?personid=0&timestamp=2017-11-23 03:10:00&heartrate=98&spo2=90
app.get('/api', function (req, res) {
	var personid = req.param('personid');
	// var timestamp = "'" + req.param('timestamp') + "'";
	var timestamp = req.param('timestamp').getTime();
	var heartrate = req.param('heartrate');
	var spo2 = req.param('spo2');

	res.send(personid + ' ' + timestamp + ' ' + spo2 + ' ' + heartrate);

	var sql_sel = "SELECT * FROM INFO_USER WHERE personid = " + personid;
	var sql_ins = "INSERT INTO PARAMETER_USER(personid, timestamp, heartrate, spo2) VALUES("
	sql_ins += personid + ", " + timestamp + ", " + heartrate + ", " + spo2 + ")";
	con.connect(function (err, client, done) {
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
				console.log('ID undefined');
		});
	});
});

app.get('/key_test', function (req, res) {
	var personid = req.param('id');
	var sql_data = "SELECT timestamp, spo2, heartrate FROM PARAMETER_USER WHERE personid = " + personid;
	// console.log(sql_data);
	con.connect(function (err, client, done) {
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
		});
	});
});

app.get("/test", function (req, res) {
	console.log("Testing");
	res.render("test-view.ejs");
});
app.get("/testpost", function (req, res) {
	console.log("Testing post-method");
	var sql_sel_max = "SELECT MAX(timestamp) FROM random";
	con.connect(function (err, client, done) {
		if (err) {
			return console.error("error connect db at KEY: ", err);
		}
		client.query(sql_sel_max, function (err0, response) {
			if (err0) {
				res.end();		//End connect. end load page
				return console.error('Select timestamp max failed...', err0.stack);
			}
			done();
			var timeend = new Date();
			console.log(timestart)

			res.send('Time: ' + req.body.timestart + ' - ' + req.body.timeend);
			// res.render("signUp.ejs");
		});
	});
});





