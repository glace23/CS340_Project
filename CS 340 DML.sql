======================================================================================================
-- Students
======================================================================================================

-- Default table for Student Lookup Page table
SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber, studentID FROM Students 
ORDER BY studentFirstName;

-- Add a new student, the :variable indicates the inputted variable
INSERT INTO Students(studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber) VALUES (:fnameInput, :lnameInput, :emailInput, :numberInput, :phoneNumberInput);

-- Update a student's data
UPDATE Students SET studentFirstName = :fnameInput, studentLastName = :lnameInput, studentEmail = :emailInput, studentNumber = :numberInput, studentPhoneNumber = :phoneNumberInput WHERE studentNumber = :numberInput; 

-- Delete a student
DELETE FROM Students WHERE id = :studentIDSelected;

-- Search for a student
SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber FROM Students
WHERE studentFirstName = :fnameInput, studentLastName = :lnameInput, studentEmail = :emailInput, studentNumber = :numberInput, studentPhoneNumber = :phoneNumberInput;

======================================================================================================
-- Professors
======================================================================================================

-- Default table for ProfessorLookup Page table
SELECT professorID, professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors ORDER BY professorFirstName;

-- Add a new professor, the :variable indicates the inputted variable
INSERT INTO Professors(professorFirstName, professorLastName, professorEmail, professorNumber) VALUES (:fnameInput, :lnameInput, :emailInput, :numberInput);

-- Update a professor's data
UPDATE Professors SET professorFirstName = :fnameInput, professorLastName = :lnameInput, professorEmail = :emailInput, professorNumber = :numberInput WHERE professorNumber = :numberInput;

-- Delete a professor
DELETE FROM Professors WHERE id = :professorIDSelected;

-- Search for a professor
SELECT professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors
WHERE professorFirstName = :fnameInput, professorLastName = :lnameInput, professorEmail = :emailInput, professorNumber = :numberInput;

======================================================================================================
-- Courses
======================================================================================================

-- Default table for Course Lookup Page table
SELECT courseID, courseName, DATE_FORMAT(courseStartDate, '%m-%d-%Y') AS startDate, DATE_FORMAT(courseEndDate, '%m-%d-%Y') AS endDate, Rooms.roomNumber AS roomN, Professors.professorFirstName AS professorFN, Professors.professorLastName AS professorLN FROM Courses 
LEFT JOIN Professors ON Courses.professorID = Professors.professorID 
LEFT JOIN Rooms ON Courses.roomID = Rooms.roomID 
ORDER BY courseName;


-- Add a new course, the :variable indicates the inputted variable
INSERT INTO Courses(courseName, courseStartDate, courseEndDate, roomID, professorID) VALUES (:courseNameInput,:startDateInput, :endDateInput, (SELECT roomID FROM Rooms WHERE roomNumber = :roomNumberInput), (SELECT professorID FROM Professors WHERE professorNumber = :professorNumberInput));

-- Update a courses's data
UPDATE Courses SET courseName = :nameInput, courseStartDate = :startDateInput, courseEndDate = :endDateInput WHERE courseName = :courseNameInput;

-- Delete a course
DELETE FROM Courses WHERE id = :courseIDSelected;

-- Search for a course
SELECT courseName, courseStartDate, courseEndDate, Rooms.roomNumber, Professors.professorFirstName, Professors.professorLastName 
FROM Courses 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID
WHERE Courses.courseName = :nameInput, Courses.courseStartDate = :startDateInput, Courses.courseEndDate = :endDateInput, Rooms.roomNumber = :roomNumberInput, professorFirstName = :fnameInput, professorLastName = :lnameInput;

======================================================================================================
-- Rooms
======================================================================================================

-- Default table look up for Rooms
SELECT Rooms.roomID, roomNumber, Courses.courseName FROM Rooms 
LEFT JOIN Courses ON Rooms.roomID = Courses.roomID 
ORDER BY roomNumber;

-- Add a new room, the :variable indicates the inputted variable
INSERT INTO Rooms(roomNumber) VALUES (:roomNumberInput);

-- Update a room number
UPDATE Rooms SET roomNumber = :roomNumberInput WHERE roomNumber = :roomNumberInput;

-- Delete a room number
DELETE FROM Rooms WHERE roomNumber = :roomNumberInput; 

-- Search for a room
SELECT roomNumber, Courses.courseName FROM Rooms
LEFT JOIN Courses ON Rooms.roomID = Courses.roomID
WHERE Rooms.roomNumber = :roomNumberInput AND Courses.courseName = :courseNameInput;

======================================================================================================
-- Enrollments
======================================================================================================

-- Default table look up for Enrollments
SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', 
Courses.courseName, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Rooms.roomNumber FROM Enrollments 
INNER JOIN Courses ON Courses.courseID = Enrollments.courseID 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Students ON Students.studentID = Enrollments.studentID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID 
ORDER BY Courses.courseName;

-- Add a new enrollment
INSERT INTO Enrollments(studentID, courseID) 
VALUES ((SELECT studentID FROM Students WHERE studentNumber = :studentNumber), 
(SELECT courseID FROM Courses WHERE courseName = :courseName));

-- Delete an enrollment
DELETE FROM Enrollments WHERE enrollmentID = :enrollmentID;

-- Update an enrollment
UPDATE Enrollments SET studentID = (SELECT studentID FROM Students WHERE studentNumber = :studentNumber), 
courseID =  (SELECT courseID FROM Courses WHERE courseName = :courseName) 
WHERE enrollmentID = :enrollmentIDInput;

-- Look up a student's courses by ID number
SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', 
Courses.courseName, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Rooms.roomNumber FROM Enrollments
INNER JOIN Courses ON Courses.courseID = Enrollments.courseID 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Students ON Students.studentID = Enrollments.studentID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID 
WHERE Students.studentNumber = :studentNumberInput
ORDER BY Courses.courseName;


-- Search for all courses and students taught by a professor by professor ID number
SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', 
Courses.courseName, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Rooms.roomNumber FROM Enrollments 
INNER JOIN Courses ON Courses.courseID = Enrollments.courseID 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Students ON Students.studentID = Enrollments.studentID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID 
WHERE Professors.professorNumber = :professorNumberInput
ORDER BY Courses.courseName;

-- Search for all students taking a course by course name and start date
SELECT enrollmentID, CONCAT(Professors.professorFirstName, ' ', Professors.professorLastName) AS 'professor', 
Courses.courseName, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS 'student', Rooms.roomNumber FROM Enrollments 
INNER JOIN Courses ON Courses.courseID = Enrollments.courseID 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Students ON Students.studentID = Enrollments.studentID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID 
WHERE Courses.courseName = :inputName AND Courses.courseStartDate = :inputDate
ORDER BY Students.studentFirstName;