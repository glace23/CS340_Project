// toggle enrollment look up form

// toggle enrollment add form
function showEnrollmentAdd(){
    add_form = document.getElementById("enrollment-add");
    if (window.getComputedStyle(add_form).display == "none"){
        add_form.hidden = false;
    } else {
        add_form.hidden = true;
    }
}

// delete enrollment using delete button
function deleteEnrollment(enrollmentID){
    var req = new XMLHttpRequest();
    var data = {};
    data.id = enrollmentID;
    
    req.open("POST", "/delete-enrollment", true);
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

let studentIDEnroll = document.getElementById("sNumber");
let courseIDEnroll = document.getElementById("courseID");
let addEnrollmentForm = document.getElementById("enrollment-add");

function addEnrollment() {   
    // form validation check
    if (!addEnrollmentForm.checkValidity()) {
        alert("Improper inputs for adding an enrollment. Please follow the format.");
        console.log(addEnrollmentForm.reportValidity());
        addEnrollmentForm.find().click();
    }
    
    // place enrollments in dictionary
    var req = new XMLHttpRequest();
    var data = {};
    data.studentIDEnroll = studentIDEnroll.value;
    data.courseIDEnroll = courseIDEnroll.value;

    // make  POST request to add
    req.open("POST", "/insert-enrollment", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            alert("Error adding enrollment.\nPlease check if student is already enrolled in class!");
        }
    })
req.send(JSON.stringify(data));
};

