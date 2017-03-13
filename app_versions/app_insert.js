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
var keys = require('./keys');
var passw = keys.pass;

var app = express();



//*****CSV reader*****



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
      password:passw,
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
    var qry_cnt = "SELECT count(1) AS num from csv where policyID=";
    qry_cnt=qry_cnt+data.policyID;

    con.query(qry_cnt,function(err,rows){
      if(err) throw err;


     console.log(rows[0].num);
     //Insert
     //Check if no record
     if(rows[0].num<1){
       console.log("Entry on CSV not found in SQL, adding entry")
       var qry_inst = "INSERT INTO csv VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
     //Insert unexistend rows
     con.query(qry_inst,[data.policyID,data.statecode,data.county,data.eq_site_limit,data.hu_site_limit,data.fl_site_limit,data.fr_site_limit,data.tiv_2011,data.tiv_2012,data.eq_site_deductible,data.hu_site_deductible,0,0,data.point_latitude,data.point_longitude,data.line,data.construction,data.point_granularity],
       function(err,result){
         if(err) throw err;
         console.log('Changed '+ result.affectedRows + ' rows');
       }


     )
   }
//Update
/*
                con.query(
        'UPDATE csv SET construction = ? Where policyID = ?',
        ["Gold", data.policyID],
        function (err, result) {
          if (err) throw err;

          console.log('Changed ' + result.changedRows + ' rows');
        }
      ); */





    });
    /*

    //ClosingSQL
    console.log("MySQL connections ended");
    con.end();
*/

  })


  //Closing CSV
    .on("end", function(){
      console.log("CSV file closed, have a nice day ;)");
    });


//****Store Procedure******
//Call procedure
/*
con.query('CALL getall()', function (err,rows){
  if(err) throw err;

  console.log('Data received from DB bep! bop! bep! \n');
  for(var i=0; i<rows[0].length;i++){
    console.log("Policy ID number: %d",i);
    console.log(rows[0][i]);
  }
});
//Call procedure with parameter
var id =995932;
var qry='CALL get_ByID(';
qry=qry+id+')'
con.query(qry, function(err,rows){
  if(err) throw err;
  console.log('Data received from DB bep! bop! bep! with parameter \n');
  console.log(rows[0][0].statecode);
});
*/









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

//Manualy set port
app.set('port',3006);
console.log("App listening on port "+ app.get('port'));

module.exports = app;
