DROP TABLE IF EXISTS Students;
CREATE TABLE Students(
    studentID INT(11) AUTO_INCREMENT UNIQUE NOT NULL,
    studentFirstName VARCHAR(255) NOT NULL,
    studentLastName VARCHAR(255) NOT NULL,
    studentEmail VARCHAR(255) UNIQUE NOT NULL,
    studentNumber VARCHAR(6) UNIQUE NOT NULL,
    studentPhoneNumber VARCHAR(10) NOT NULL,
    PRIMARY KEY(studentID)
    );

DROP TABLE IF EXISTS Rooms;
CREATE TABLE Rooms(
    roomID INT(11) AUTO_INCREMENT UNIQUE NOT NULL,
    roomNumber VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY(roomID)
    );

DROP TABLE IF EXISTS Professors;
CREATE TABLE Professors(
    professorID INT(11) AUTO_INCREMENT UNIQUE NOT NULL,
    professorFirstName VARCHAR(255) NOT NULL,
    professorLastName VARCHAR(255) NOT NULL,
    professorEmail VARCHAR(255) UNIQUE NOT NULL,
    professorNumber VARCHAR(5) UNIQUE NOT NULL,
    PRIMARY KEY(professorID)
    );
    
DROP TABLE IF EXISTS Courses;
CREATE TABLE Courses(
    courseID INT(11) AUTO_INCREMENT UNIQUE NOT NULL,
    courseName VARCHAR(255) NOT NULL,
    courseStartDate DATE NOT NULL,
    courseEndDate DATE NOT NULL,
    roomID INT(11) DEFAULT NULL,
    professorID INT(11) DEFAULT NULL,
    PRIMARY KEY(courseID),
    FOREIGN KEY(roomID) REFERENCES Rooms(roomID)
	ON DELETE SET NULL,
	FOREIGN KEY(professorID) REFERENCES Professors(professorID)
	ON DELETE SET NULL,
	CONSTRAINT course_key UNIQUE (courseName, courseStartDate)
    );
    
     
 DROP TABLE IF EXISTS Enrollments;
 CREATE TABLE Enrollments(
     enrollmentID INT(11) AUTO_INCREMENT UNIQUE NOT NULL,
     studentID INT(11),
     courseID INT(11),
     PRIMARY KEY(enrollmentID),
     FOREIGN KEY(studentID) REFERENCES Students(studentID) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
     FOREIGN KEY(courseID) REFERENCES Courses(courseID) 
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	CONSTRAINT enrollment_key UNIQUE (studentID, courseID)
     );

DESCRIBE Students;
DESCRIBE Professors;
DESCRIBE Courses;
DESCRIBE Rooms;
DESCRIBE Enrollments;


INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES ("Jim", "Jones", "jjones@osu.edu", "363098", "2823031598");
INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES ("Wulf", "Archana", "warchana@osu.edu", "432238", "9122411950");
INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES ("Eustorgios", "Andrei", "eandrei@osu.edu", "981843", "9285860595");
INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES ("Shun", "Aseneth", "saseneth@osu.edu", "827089", "4089316259");
INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES ("Corrie", "Sophea", "csophea@osu.edu", "459109", "4938306544");

INSERT INTO Professors(professorFirstName, professorLastName, professorEmail, professorNumber) VALUES ("Kiera", "Constant", "kconstant@osu.edu", "63079"); 
INSERT INTO Professors(professorFirstName, professorLastName, professorEmail, professorNumber) VALUES ("Jocelyne", "Lukas", "jlukas@osu.edu", "19047"); 
INSERT INTO Professors(professorFirstName, professorLastName, professorEmail, professorNumber) VALUES ("Rita", "Pravin", "rpravin@osu.edu", "51729"); 

INSERT INTO Rooms(roomNumber) VALUES ("A102");
INSERT INTO Rooms(roomNumber) VALUES ("L306");
INSERT INTO Rooms(roomNumber) VALUES ("C441");
INSERT INTO Rooms(roomNumber) VALUES ("D201");

INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES ("CS340", "2021-07-01", "2021-08-15", 1, 2); 
INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES ("CS161", "2021-07-01", "2021-08-15", 2, 3); 
INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES ("CS162", "2021-07-01", "2021-08-15", 3, 1); 

INSERT INTO Enrollments(studentID, courseID) VALUES (1, 1);
INSERT INTO Enrollments(studentID, courseID) VALUES (1, 3);
INSERT INTO Enrollments(studentID, courseID) VALUES (2, 3);
INSERT INTO Enrollments(studentID, courseID) VALUES (2, 2);
INSERT INTO Enrollments(studentID, courseID) VALUES (3, 1);
INSERT INTO Enrollments(studentID, courseID) VALUES (3, 3);
INSERT INTO Enrollments(studentID, courseID) VALUES (4, 2);
INSERT INTO Enrollments(studentID, courseID) VALUES (5, 1);
INSERT INTO Enrollments(studentID, courseID) VALUES (5, 2);
INSERT INTO Enrollments(studentID, courseID) VALUES (5, 3);

SELECT
    CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'Student Name',
    studentEmail,
    studentNumber,
    studentPhoneNumber,
    courseName,
    courseStartDate,
    courseEndDate,
    roomNumber,
    CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'Professor Name',
    Professors.professorEmail,
    Professors.professorNumber
FROM Students
JOIN Enrollments ON Enrollments.studentID = Students.studentID
JOIN Courses ON Courses.courseID = Enrollments.courseID
JOIN Rooms ON Rooms.roomID = Courses.roomID
JOIN Professors ON Professors.professorID = Courses.professorID;