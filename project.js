var express = require('express');
var path = require('path');
var app = express();
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

PORT = 30245;

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);
app.set('mysql', mysql);
app.use(express.static('public'));

// post
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
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

app.get('/professor',function(req,res){
  res.render('professorlookup')
});

app.get('/course',function(req,res){
  res.render('courselookup')
});

app.get('/room',function(req,res){
  res.render('roomlookup')
});


//====================== STUDENT SQL FUNCTIONS ======================
app.get('/student', function (req, res){
  context = {};
  select_query = "SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber, studentID FROM Students";
  mysql.pool.query(select_query, (error, results, fields) => {
    if(error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.students = results;
    return res.render('studentlookup', context);
  });
});

app.post('/delete-student', function (req, res, next){
  delete_query = "DELETE FROM Students WHERE studentID = ?;";
  mysql.pool.query(delete_query, [req.body.id], function(err, result) {
    if (err) {
      next(err);
      return
    }
    res.send();
  })
});

app.post('/insert-student', function (req, res, next) {
  insert_query = "INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES (?, ?, ?, ?, ?);";
  mysql.pool.query(insert_query, 
    [req.body.studentFirstName, req.body.studentLastName, req.body.studentEmail, req.body.studentNumber, req.body.studentPhoneNumber],
    function(err, result) {
      if (err) {
        next(err);
        return
      }
      res.send();
    })
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