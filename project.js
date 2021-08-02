var express = require('express');
var path = require('path');
var app = express();
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

PORT = 30342;

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

app.get('/enrollment',function(req,res){
  res.render('enrollment')
});


//====================== Professors SQL Functions ======================
app.get('/professor',function(req,res){
  res.render('professorlookup')
});


//====================== Courses SQL Functions ======================
app.get('/course',function(req,res){
  res.render('courselookup')
});

//====================== Rooms SQL Functions ======================
app.get('/room', function (req, res){
  context = {};
  select_query = "SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID;";
  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.room = results;
    return res.render('roomlookup', context);
  });
});

app.post('/delete-room', function (req, res, next){
  delete_query = "DELETE FROM Rooms WHERE roomID = ?;";
  mysql.pool.query(delete_query, [req.body.id], function(err, result) {
    if (err) {
      next(err);
      return
    }
    res.send();
  })
});

app.post('/insert-room', function (req, res, next) {
  insert_query = "INSERT INTO Rooms(roomNumber) VALUES (?);";
  mysql.pool.query(insert_query, [req.body.roomNumber], function(err, result) {
      if (err) {
        next(err);
        return
      }
      res.send();
    })
});


//====================== Students SQL Functions ======================
app.get('/student', function (req, res){
  context = {};
  select_query = "SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber, studentID FROM Students";
  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
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