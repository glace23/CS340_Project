var express = require('express');
var path = require('path');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path')

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 30245);

// post
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

app.get('/lookup/student',function(req,res){
  res.render('studentlookup')
});

app.get('/lookup/professor',function(req,res){
  res.render('professorlookup')
});

app.get('/lookup/course',function(req,res){
  res.render('courselookup')
});

app.get('/lookup/room',function(req,res){
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