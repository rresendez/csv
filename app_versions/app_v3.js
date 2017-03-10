var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var csv = require('fast-csv');
var mysql = require("mysql");



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//Manualy set port

var server = app.listen(3005,function(){
  console.log('Ready on port %d', server.address().port);
})


//*****CSV reader*****
//Utility counter


//File location
var stream = fs.createReadStream('./CSV/small_sample.csv');
//Opening CSV
  console.log("Retriving info from CSV");
//CSV fast-csv object setup

csv
  .fromStream(stream, {headers: true})
// Validation

  .on("data", function(data){

    //******MySQL*******

    //MySQL conneciton to db

    var con = mysql.createConnection({
      host: "localhost",
      user:"root",
      password:"Rodriguez24",
      database: "ingenium"
    });

    //Estabilishg connection

    con.connect(function(err){
      if(err){
        console.log('Error conecting to MySQL');
        return;
      }
      console.log('Connection to MySQL established');
    });

    //Creating query

    con.query('SELECT * FROM csv',function(err,rows){
      if(err) throw err;


      for (var i=0; i< rows.length;i++){
        console.log("CSV ID");
        console.log(rows[i].policyID);
        console.log("MySQL ID");
        console.log(data.policyID);
        if(rows[i].policyID==data.policyID){
          console.log("Match found");

                con.query(
        'UPDATE csv SET construction = ? Where policyID = ?',
        ["Gold", data.policyID],
        function (err, result) {
          if (err) throw err;

          console.log('Changed ' + result.changedRows + ' rows');
        }
      );
          break;


        }

      };


    });


  })
  .on("end", function(){
    console.log("CSV file closed, have a nice day ;)");
  });




//Closing Connection




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
