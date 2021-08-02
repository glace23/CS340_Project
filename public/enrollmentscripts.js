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

let addEnrollmentButton = document.getElementById("addEnrollment");
let studentIDEnroll = document.getElementById("sNumber");
let courseNameEnroll = document.getElementById("courseName");
let addEnrollmentForm = document.getElementById("enrollment-add");

// Listen for adding a new enrollment
window.onload=function() {
    addEnrollmentButton.addEventListener("click", (event) => {
        event.preventDefault();
        
        // form validation check
        if (!addEnrollmentForm.checkValidity()) {
            alert("Improper inputs for adding an enrollment. Please follow the format.");
            console.log(addEnrollmentForm.reportValidity());
            addEnrollmentForm.find(':submit').click();
        }
        
        // place enrollments in dictionary
        var req = new XMLHttpRequest();
        var data = {};
        data.studentIDEnroll = studentIDEnroll.value;
        data.courseNameEnroll = courseNameEnroll.value;

        // make  POST request to add
        req.open("POST", "/insert-enrollment", true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                window.location.reload();
            } else {
                alert("Error adding enrollment.");
            }
        })
    req.send(JSON.stringify(data));
    });
}
