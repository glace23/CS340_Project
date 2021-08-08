var express = require('express');
var path = require('path');
var app = express();
var mysql = require('./dbcon.js');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

PORT = 30334;

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


//====================== Enrollments SQL Functions ======================
app.get('/enrollment', function (req, res){
  context = {};
  let select_query;
  if (Object.keys(req.query).length === 0){
    select_query = "SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', Professors.professorNumber, Courses.courseName, DATE_FORMAT(Courses.courseStartDate, '%Y-%m-%d') AS startDate, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Students.studentNumber, Rooms.roomNumber FROM Enrollments INNER JOIN Courses ON Courses.courseID = Enrollments.courseID INNER JOIN Professors ON Courses.professorID = Professors.professorID INNER JOIN Students ON Students.studentID = Enrollments.studentID INNER JOIN Rooms ON Courses.roomID = Rooms.roomID";
  }
  else
  {
    let where_query = " WHERE "
    if (req.query.studentnumber !== undefined){
      where_query = where_query + `studentNumber LIKE "${req.query.studentnumber}%"`;
    }
    if (req.query.professornumber !== undefined){
      where_query = where_query + `professorNumber LIKE "${req.query.professornumber}%"`;
    }
    if (req.query.coursename !== undefined){
      where_query = where_query + `courseName LIKE "${req.query.coursename}%" AND ` + `courseStartDate LIKE "${req.query.coursestart}%"`;
    }
    select_query = "SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', Professors.professorNumber, Courses.courseName, DATE_FORMAT(Courses.courseStartDate, '%Y-%m-%d') AS startDate, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Students.studentNumber, Rooms.roomNumber FROM Enrollments INNER JOIN Courses ON Courses.courseID = Enrollments.courseID INNER JOIN Professors ON Courses.professorID = Professors.professorID INNER JOIN Students ON Students.studentID = Enrollments.studentID INNER JOIN Rooms ON Courses.roomID = Rooms.roomID"
    + where_query.substring(0, where_query.length);
  }

  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.enrollments = results;
    
    //Select for courses and course IDs
    let select_courses = "SELECT * FROM Courses"
    mysql.pool.query(select_courses, (error, results, fields) => {
      if (error) {
          res.write(JSON.stringify(error));
          res.end();
      }
      context.courses = results;

      //Select for student names and student IDs
      let select_students = "SELECT CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'studentName', studentID FROM Students"
      mysql.pool.query(select_students, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.students = results;
        return res.render('enrollment', context);
      });
    });
  });
});

app.post('/delete-enrollment', function (req, res, next){
  delete_query = "DELETE FROM Enrollments WHERE enrollmentID = ?";
  mysql.pool.query(delete_query, [req.body.id], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    res.send();
  })
});

app.post('/insert-enrollment', function (req, res, next) {
  insert_query = "INSERT INTO Enrollments(studentID, courseID) VALUES (?, ?);";
  mysql.pool.query(insert_query, 
    [req.body.studentIDEnroll, req.body.courseNameEnroll],
    function(err, result) {
      if (err) {
        next(err);
        return;
      }
      res.send();
    })
});



//====================== Professors SQL Functions ======================
app.get('/professor', function (req, res){
  context = {};
  let select_query;
  if (Object.keys(req.query).length === 0){
    select_query = "SELECT professorID, professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors";
  }
  else
  {
    let where_query = " WHERE "
    if (req.query.professorfname !== ''){
      where_query = where_query + `professorFirstName LIKE "${req.query.professorfname}%" OR `;
    }
    if (req.query.professorlname !== ''){
      where_query = where_query + `professorLastName LIKE "${req.query.professorlname}%" OR `;
    }
    if (req.query.professoremail !== ''){
      where_query = where_query + `professorEmail LIKE "${req.query.professoremail}%" OR `;
    }
    if (req.query.professornumber !== ''){
      where_query = where_query + `professorNumber LIKE "${req.query.professornumber}%" OR `;
    }
    select_query = "SELECT professorID, professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors" + where_query.substring(0, where_query.length-3);
  }
  
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

app.post('/update-professor', function (req, res, next){
  update_query = "UPDATE Professors SET professorFirstName = ?, professorLastName = ?, professorEmail = ? WHERE professorID = ?";
  mysql.pool.query(update_query, [req.body.professorFirstName, req.body.professorLastName, req.body.professorEmail, req.body.id], 
    function(err, result) {
    if (err) {
      next(err);
      return
    }
    res.send();
  })
});



//====================== Courses SQL Functions ======================
app.get('/course', function (req, res){
  context = {};
    let select_query;
  if (Object.keys(req.query).length === 0){
    select_query = "SELECT courseID, courseName, DATE_FORMAT(courseStartDate, '%Y-%m-%d') AS startDate, DATE_FORMAT(courseEndDate, '%Y-%m-%d') AS endDate, Rooms.roomID, Rooms.roomNumber AS roomN, Professors.professorID, Professors.professorNumber, Professors.professorFirstName AS professorFN, Professors.professorLastName AS professorLN FROM Courses LEFT JOIN Professors ON Courses.professorID = Professors.professorID LEFT JOIN Rooms ON Courses.roomID = Rooms.roomID"
  }
  else
  {
    let where_query = " WHERE "
    if (req.query.coursename !== ''){
      where_query = where_query + `courseName LIKE "${req.query.coursename}%" OR `;
    }
    if (req.query.coursestart !== ''){
      where_query = where_query + `courseStartDate LIKE "${req.query.coursestart}%" OR `;
    }
    if (req.query.courseend !== ''){
      where_query = where_query + `courseEndDate LIKE "${req.query.courseend}%" OR `;
    }
    if (req.query.roomnumber !== ''){
      where_query = where_query + `roomNumber LIKE "${req.query.roomnumber}%" OR `;
    }
    if (req.query.professorfname !== ''){
      where_query = where_query + `professorFirstName LIKE "${req.query.professorfname}%" OR `;
    }
    if (req.query.professorlname !== ''){
      where_query = where_query + `professorLastName LIKE "${req.query.professorlname}%" OR `;
    }

    select_query = "SELECT courseID, courseName, DATE_FORMAT(courseStartDate, '%Y-%m-%d') AS startDate, DATE_FORMAT(courseEndDate, '%Y-%m-%d') AS endDate, Rooms.roomID, Rooms.roomNumber AS roomN, Professors.professorID, Professors.professorNumber, Professors.professorFirstName AS professorFN, Professors.professorLastName AS professorLN FROM Courses LEFT JOIN Professors ON Courses.professorID = Professors.professorID LEFT JOIN Rooms ON Courses.roomID = Rooms.roomID"
     + where_query.substring(0, where_query.length-3);
  };

  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        res.write(JSON.stringify(error));
        res.end();
    }
    context.courses = results;

    //Select for room number and room id
    let select_room = "SELECT * FROM Rooms"
    mysql.pool.query(select_room, (error, results, fields) => {
      if (error) {
          res.write(JSON.stringify(error));
          res.end();
      }
      context.rooms = results;

      //Select for professor name and professor ID
      let select_professor = "SELECT CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professorName', professorID FROM Professors"
      mysql.pool.query(select_professor, (error, results, fields) => {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        context.professors = results;
        return res.render('courselookup', context);
      });
    });
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
  insert_query = "INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES (?, ?, ?, ?, ?);";
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

app.post('/update-course', function (req, res, next){
  context = {};
  update_query = "UPDATE Courses SET courseStartDate = ?, courseEndDate = ?, roomID = ?, professorID = ? WHERE courseID = ?";
  mysql.pool.query(update_query, [req.body.startDate, req.body.endDate, req.body.roomID, req.body.professorID, req.body.id], 
    function(err, result) {
      if (err) {
        next(err);
        return
      }
    res.send();
  });
});


//====================== Rooms SQL Functions ======================
app.get('/room', function (req, res){
  context = {};
  let select_query;
  if (Object.keys(req.query).length === 0){
    select_query = "SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID";
  }
  else
  {
    let where_query = " WHERE "
    if (req.query.roomNumber !== ''){
      where_query = where_query + `roomNumber LIKE "${req.query.roomNumber}%" OR `;
    }
    if (req.query.courseName !== ''){
      where_query = where_query + `courseName LIKE "${req.query.courseName}%" OR `;
    }
    select_query = "SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms LEFT JOIN Courses ON Rooms.roomID = Courses.roomID" + where_query.substring(0, where_query.length-3);
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
  let select_query;
  if (Object.keys(req.query).length === 0){
    select_query = "SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber, studentID FROM Students";
  }
  else
  {
    let where_query = " WHERE "
    if (req.query.studentfname !== ''){
      where_query = where_query + `studentFirstName LIKE "${req.query.studentfname}%" OR `;
    }
    if (req.query.studentlname !== ''){
      where_query = where_query + `studentLastName LIKE "${req.query.studentlname}%" OR `;
    }
    if (req.query.studentemail !== ''){
      where_query = where_query + `studentEmail LIKE "${req.query.studentemail}%" OR `;
    }
    if (req.query.studentnumber !== ''){
      where_query = where_query + `studentNumber LIKE "${req.query.studentnumber}%" OR `;
    }
    if (req.query.studentphonenumber !== ''){
      where_query = where_query + `studentPhoneNumber LIKE "${req.query.studentphonenumber}%" OR `;
    }
    select_query = "SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber, studentID FROM Students" + where_query.substring(0, where_query.length-3);
  }

  mysql.pool.query(select_query, (error, results, fields) => {
    if (error) {
        console.log("error");
        res.write(JSON.stringify(error));
        res.end();
        return;
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