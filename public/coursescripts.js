// toggle course look up form
function showCourseLookup(){
    lookup_form = document.getElementById("course-lookup");
    add_form = document.getElementById("course-add");
    if (window.getComputedStyle(lookup_form).display == "none"){
        if (window.getComputedStyle(add_form).display != "none"){
            add_form.hidden = true;
        }
        lookup_form.hidden = false;
    } else {
        lookup_form.hidden = true;
    }
}

// toggle course add form
function showCourseAdd(){
    lookup_form = document.getElementById("course-lookup");
    add_form = document.getElementById("course-add");
    if (window.getComputedStyle(add_form).display == "none"){
        if (window.getComputedStyle(lookup_form).display != "none"){
            lookup_form.hidden = true;
        }
        add_form.hidden = false;
    } else {
        add_form.hidden = true;
    }
}

function deleteCourse(courseID) {
    var req = new XMLHttpRequest();
   var data = {};
   data.id = courseID;
   
   req.open("POST", "/delete-course", true);
   req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   req.addEventListener("load", () => {
       if (req.status >= 200 && req.status < 400) {
           window.location.reload();
       } else {
           console.log("ERROR");
       }
   })

   req.send(JSON.stringify(data));
}

let addCourseForm = document.getElementById("course-add");
let addCourseButton = document.getElementById("addCourse");
let courseNameAdd = document.getElementById("cname");
let courseStartDateAdd = document.getElementById("cstart");
let courseEndDateAdd = document.getElementById("cend");
let courseRoomAdd = document.getElementById("croom");
let professorIDAdd = document.getElementById("pnumber")

// Listen for adding a new course
addCourseButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    // form validation check
    if (!addCourseForm.checkValidity()) {
        alert("Improper inputs for adding a course. Please follow the format.");
        console.log(addCourseForm.reportValidity());
        addCourseForm.find(':submit').click();
    }
    
    // place courses in dictionary
    var req = new XMLHttpRequest();
    var data = {};
    data.courseName = courseNameAdd.value;
    data.courseStartDateAdd = courseStartDateAdd.value;
    data.courseEndDateAdd = courseEndDateAdd.value;
    data.courseRoomAdd = courseRoomAdd.value;
    data.courseProfessor = professorIDAdd.value;

    // make  POST request to add
    req.open("POST", "/insert-course", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            alert("Error adding course");
        }
    })
req.send(JSON.stringify(data));
});


function updateCourse(courseID, professorNumber, roomID, professorID){
    let course = document.getElementById("course" + courseID);
    let courseName = course.cells[0].innerHTML;
    let courseStartDate = course.cells[1].innerHTML;
    let courseEndDate = course.cells[2].innerHTML;
    let roomNumber = course.cells[3].innerHTML;
    if (professorNumber == undefined){
        professorNumber = ''
    }
    document.getElementById("editName").value = courseName;
    document.getElementById("editStart").value = courseStartDate;
    document.getElementById("editEnd").value = courseEndDate;
    document.getElementById("editRoomNumber").value = roomID;
    document.getElementById("editProfessorNumber").value = professorID;
    document.getElementById("editcid").value = courseID;
    document.getElementById("updateCourse").hidden = false;

}


function saveUpdateCourse() {
   var req = new XMLHttpRequest();
   var data = {};
    data.courseName = document.getElementById("editName").value;
    data.startDate = document.getElementById("editStart").value;
    data.endDate = document.getElementById("editEnd").value;
    data.roomID = document.getElementById("editRoomNumber").value;
    data.professorID = document.getElementById("editProfessorNumber").value;
    data.id = document.getElementById("editcid").value;
   
   req.open("POST", "/update-course", true);
   req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   req.addEventListener("load", () => {
       if (req.status >= 200 && req.status < 400) {
           window.location.reload();
       } else {
           console.log("ERROR");
       }
   })

   req.send(JSON.stringify(data));
   document.getElementById("updateCourse").hidden = true;
}