function checkString(){
    let checkfname = document.getElementById("studentfname").value;
    let checklname = document.getElementById("studentlname").value;
    let checkemail = document.getElementById("studentemail").value;
    let checknumber = document.getElementById("studentnumber").value;
    let checkphonenumber = document.getElementById("studentphonenumber").value;
    let search = '';

    if (checkfname !== ''){
        search = search.concat(" First name:");
        search = search.concat(checkfname);
    }
    if (checklname !== ''){
        search = search.concat(" Last name:");
        search = search.concat(checklname);
    }
    if (checkemail !== ''){
        search = search.concat(" Email:");
        search = search.concat(checkemail);
    }
    if (checknumber !== ''){
        search = search.concat(" Number:");
        search = search.concat(checknumber);
    }
    if (checkphonenumber !== ''){
        search = search.concat(" Phone Number:");
        search = search.concat(checkphonenumber);
    }
    if (search === ''){
        search = "All fields were left blank";
        document.getElementById("searchvalue").innerHTML = search;
        return false;
    }
    document.getElementById("searchvalue").innerHTML = search;
    return false;
}

// toggle student look up form
function showStudentLookup(){
    lookup_form = document.getElementById("student-lookup");
    add_form = document.getElementById("student-add");
    if (window.getComputedStyle(lookup_form).display == "none"){
        if (window.getComputedStyle(add_form).display != "none"){
            add_form.hidden = true;
        }
        lookup_form.hidden = false;
    } else {
        lookup_form.hidden = true;
    }
}

// toggle student add form
function showStudentAdd(){
    lookup_form = document.getElementById("student-lookup");
    add_form = document.getElementById("student-add");
    if (window.getComputedStyle(add_form).display == "none"){
        if (window.getComputedStyle(lookup_form).display != "none"){
            lookup_form.hidden = true;
        }
        add_form.hidden = false;
    } else {
        add_form.hidden = true;
    }
}

function deleteStudent(studentID) {
   var req = new XMLHttpRequest();
   var data = {};
   data.id = studentID;
   
   req.open("POST", "/delete-student", true);
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

let addStudentButton = document.getElementById("addStudent");
let studentFirstNameAdd = document.getElementById("sfname");
let studentLastNameAdd = document.getElementById("slname");
let studentEmailAdd = document.getElementById("semail");
let studentNumberAdd = document.getElementById("snumber");
let studentPhoneNumberAdd = document.getElementById("sphone");
// Listen for adding a new student
addStudentButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    // place students in dictionary
    var req = new XMLHttpRequest();
    var data = {};
    data.studentFirstName = studentFirstNameAdd.value;
    data.studentLastName = studentLastNameAdd.value;
    data.studentEmail = studentEmailAdd.value;
    data.studentNumber = studentNumberAdd.value;
    data.studentPhoneNumber = studentPhoneNumberAdd.value;

    // make  POST request to add
    req.open("POST", "/insert-student", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            alert("Error adding student");
        }
    })
   req.send(JSON.stringify(data));
})