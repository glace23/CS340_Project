======================================================================================================
-- Students
======================================================================================================

-- Default table for Student Lookup Page table
SELECT studentFirstName, studentLastName, studentEmail, studentNumber, studentPhoneNumber FROM Students;

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
SELECT professorFirstName, professorLastName, professorEmail, professorNumber FROM Professors;

-- Add a new professor, the :variable indicates the inputted variable
INSERT INTO Professors (professorFirstName, professorLastName, professorEmail, professorNumber) VALUES (:fnameInput, :lnameInput, :emailInput, :numberInput);

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
SELECT courseName, courseStartDate, courseEndDate, Rooms.roomNumber, Professors.professorFirstName, Professors.professorLastName 
FROM Courses 
INNER JOIN Professors ON Courses.professorID = Professors.professorID 
INNER JOIN Rooms ON Courses.roomID = Rooms.roomID;

-- Add a new course, the :variable indicates the inputted variable
INSERT INTO Courses(courseName, courseStartDate, courseEndDate) VALUES (:nameInput,:startDateInput, :endDateInput);

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
SELECT roomNumber, Courses.courseName FROM Rooms
INNER JOIN Courses ON Rooms.roomID = Courses.roomID;

-- Add a new room, the :variable indicates the inputted variable
INSERT INTO Rooms(roomNumber) VALUES (:roomNumberInput);

-- Update a room number
UPDATE Rooms SET roomNumber = :roomNumberInput WHERE roomNumber = :roomNumberInput;

-- Delete a room number
DELETE FROM Rooms WHERE roomNumber = :roomNumberInput; 

-- Search for a room
SELECT roomNumber, Courses.courseName FROM Rooms
INNER JOIN Courses ON Rooms.roomID = Courses.roomID
WHERE Rooms.roomNumberInput = :roomNumberInput, Courses.courseName = :courseNameInput;

======================================================================================================
-- Registration Look up
======================================================================================================

-- Look up a student's courses by ID number
SELECT studentFirstName, studentLastName, studentEmail, studentNumber, Courses.courseName FROM Students
INNER JOIN Enrollments ON Students.studentID = Enrollments.studentID
INNER JOIN Courses on Courses.courseID = Enrollments.courseID
WHERE Students.studentNumber = :studentNumberInput;


-- Search for all courses and students taught by a professor by professor ID number
SELECT professorFirstName, professorLastName, Courses.courseName, Students.studentFirstName, Students.studentLastName FROM Professors
INNER JOIN Courses ON Courses.professorID = Professors.professorID
INNER JOIN Enrollments ON Enrollments.courseID = Courses.courseID
INNER JOIN Students ON Students.studentID = Enrollments.studentID
WHERE Professors.professorNumber = :professorNumberInput;


-- Search for all students taking a course by course name and start date
SELECT courseName, courseStartDate, CONCAT(Students.studentFirstName, ' ', Students.studentLastName) AS student FROM Courses
INNER JOIN Enrollments ON Enrollments.courseID = Courses.courseID
INNER JOIN Students ON Students.studentID = Enrollments.studentID
WHERE Courses.courseName = :inputName AND Courses.courseStartDate = :inputDate;