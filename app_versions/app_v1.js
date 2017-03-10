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
    console.log(rows[i]);
  };


});

//Closing Connection

con.end(function(err){
  console.log("Connection terminated");
});
/*
//*****CSV reader*****
//Utility counter
var i =0 ;
var id=172534;

//File location
var stream = fs.createReadStream('./CSV/small_sample.csv');
//Opening CSV
  console.log("Retriving info from CSV");
//CSV fast-csv object setup
console.log("Return only data policy with ID %d",id);
csv
  .fromStream(stream, {headers: true})
// Validation
  .validate(function(data){

     return data.policyID = id;
  })
  .on("data", function(data){
    if(data.construction=='Glass'){
    //if(true){
      console.log(data);
      console.log("  Iteration: "+i+"\n");
      i++;
    }

  })
  .on("end", function(){
    console.log("CSV file closed, have a nice day ;)");
  });
  */

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
