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
app.get('/professor', function (req, res){
  context = {};
  select_query = "SELECT professorID, professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors;";
  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.professors = results;
    return res.render('professorlookup', context);
  });
});

app.post('/delete-professor', function (req, res, next){
  delete_query = "DELETE FROM Professors WHERE professorID = ?";
  mysql.pool.query(delete_query, [req.body.id], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    res.send();
  })
});

app.post('/insert-professor', function (req, res, next) {
  insert_query = "INSERT INTO Professors (professorFirstName, professorLastName, professorEmail, professorNumber) VALUES (?, ?, ?, ?);";
  mysql.pool.query(insert_query, [req.body.professorFirstName, req.body.professorLastName, req.body.professorEmail, req.body.professorNumber], function(err, result) {
      if (err) {
        next(err);
        return;
      }
      res.send();
    })
});


//====================== Courses SQL Functions ======================
app.get('/course', function (req, res){
  context = {};
  select_query = "SELECT courseID, courseName, DATE_FORMAT(courseStartDate, '%m-%d-%Y') AS startDate, DATE_FORMAT(courseEndDate, '%m-%d-%Y') AS endDate, Rooms.roomNumber AS roomN, Professors.professorFirstName AS professorFN, Professors.professorLastName AS professorLN FROM Courses LEFT JOIN Professors ON Courses.professorID = Professors.professorID LEFT JOIN Rooms ON Courses.roomID = Rooms.roomID;";
  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.courses = results;
    return res.render('courselookup', context);
  });
});

app.post('/delete-course', function (req, res, next){
  delete_query = "DELETE FROM Courses WHERE courseID = ?";
  mysql.pool.query(delete_query, [req.body.id], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    res.send();
  })
});

app.post('/insert-course', function (req, res, next) {
  insert_query = "INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES (?, ?, ?, (SELECT roomID FROM Rooms WHERE roomNumber = ?), (SELECT professorID FROM Professors WHERE professorNumber = ?));";
  mysql.pool.query(insert_query, 
    [req.body.courseName, req.body.courseStartDateAdd, req.body.courseEndDateAdd, req.body.courseRoomAdd, req.body.courseProfessor],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      res.send();
    })
});


//====================== Rooms SQL Functions ======================
app.get('/room', function (req, res){
  context = {};
  select_query = "SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID;";

  // For search queries
  if (req.query.roomNumber != '' && req.query.courseName == '') {
    select_query = `SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID WHERE roomNumber = '${req.query.roomNumber}';`;
  } else if (req.query.roomNumber == '' && req.query.courseName != '') {
    select_query = `SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID WHERE Courses.courseName = '${req.query.courseName}';`;
  } else if (req.query.roomNumber != undefined && req.query.courseName != undefined) {
    select_query = `SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID WHERE roomNumber = '${req.query.roomNumber}' AND Courses.courseName = '${req.query.courseName}';`;
  } 
  
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

app.post('/update-student', function (req, res, next){
  update_query = "UPDATE Students SET studentFirstName = ?, studentLastName = ?, studentEmail = ?, studentPhoneNumber = ? WHERE studentID = ?";
  mysql.pool.query(update_query, [req.body.studentFirstName, req.body.studentLastName, req.body.studentEmail, req.body.studentPhoneNumber, req.body.id], 
    function(err, result) {
    if (err) {
      next(err);
      return
    }
    res.send();
  })
});


app.get('/lookup-student', function (req, res){
  context = {};
  select_query = "SELECT * FROM Students WHERE studentFirstName = ?";
  console.log = req.query;
  mysql.pool.query(select_query, [req.query.studentFirstName], 
    (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.lookup = results;
    res.render('slookup', context);
  });
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