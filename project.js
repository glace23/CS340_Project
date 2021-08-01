var express = require('express');
var path = require('path');
var app = express();
var mysql = require('./database/dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

PORT = 30338;

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('mysql', mysql);

// post
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/student', function (req, res){
  context = {};
  select_query = "SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber FROM Students";
  mysql.pool.query(select_query, (error, results, fields) => {
    if(error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.students = results;
    return res.render('studentlookup', context);
  });
});

app.get('/css', function(req,res){
      var options = { 
        root: path.join(__dirname + "/public/css") 
    }; 
  res.sendFile("style.css", options);
});

app.get('/',function(req,res){
  res.render('home')
});

app.get('/lookup',function(req,res){
  res.render('lookup')
});

app.get('/professor',function(req,res){
  res.render('professorlookup')
});

app.get('/course',function(req,res){
  res.render('courselookup')
});

app.get('/room',function(req,res){
  res.render('roomlookup')
});



app.get('/add',function(req,res){
  res.render('add')
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});