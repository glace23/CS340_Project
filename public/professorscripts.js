// toggle professor look up form
function showProfessorLookup(){
    lookup_form = document.getElementById("professor-lookup");
    add_form = document.getElementById("professor-add");
    if (window.getComputedStyle(lookup_form).display == "none"){
        if (window.getComputedStyle(add_form).display != "none"){
            add_form.hidden = true;
        }
        lookup_form.hidden = false;
    } else {
        lookup_form.hidden = true;
    }
}

// toggle professor add form
function showProfessorAdd(){
    lookup_form = document.getElementById("professor-lookup");
    add_form = document.getElementById("professor-add");
    if (window.getComputedStyle(add_form).display == "none"){
        if (window.getComputedStyle(lookup_form).display != "none"){
            lookup_form.hidden = true;
        }
        add_form.hidden = false;
    } else {
        add_form.hidden = true;
    }
}


// delete professor using delete button
function deleteProfessor(professorID){
    var req = new XMLHttpRequest();
    var data = {};
    data.id = professorID;
    
    req.open("POST", "/delete-professor", true);
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

let addProfessorForm = document.getElementById("professor-add");
let professorFirstNameAdd = document.getElementById("pfname");
let professorLastNameAdd = document.getElementById("plname");
let professorEmailAdd = document.getElementById("pemail");
let professorNumberAdd = document.getElementById("pnumber");

function addProfessor() {
    // form validation check
    if (!addProfessorForm.checkValidity()) {
        alert("Improper inputs for adding a professor. Please try again.");
        addProfessorForm.find().click()
    }
    
    // place professors in dictionary
    var req = new XMLHttpRequest();
    var data = {};
    data.professorFirstName = professorFirstNameAdd.value;
    data.professorLastName = professorLastNameAdd.value;
    data.professorEmail = professorEmailAdd.value;
    data.professorNumber = professorNumberAdd.value;

    // make  POST request to add
    req.open("POST", "/insert-professor", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            alert("Error adding professor");
        }
    })
req.send(JSON.stringify(data));
};


function updateProfessor(professorID){
    let professor = document.getElementById("professor" + professorID);
    let professorFirstName = professor.cells[0].innerHTML;
    let professorLastName = professor.cells[1].innerHTML;
    let professorEmail = professor.cells[2].innerHTML;
    let professorNumber = professor.cells[3].innerHTML;
    document.getElementById("editfname").value = professorFirstName;
    document.getElementById("editlname").value = professorLastName;
    document.getElementById("editemail").value = professorEmail;
    document.getElementById("editnumber").value = professorNumber;
    document.getElementById("editProfessorid").value = professorID;
    document.getElementById("updateProfessor").hidden = false;

}


function saveUpdateProfessor() {
    let updateProfessorForm = document.getElementById("professor-update");
    // form validation check
    if (!updateProfessorForm.checkValidity()) {
        alert("Improper inputs for updating a professor. Please try again.");
        updateProfessorForm.find().click()
    }

    var req = new XMLHttpRequest();
    var data = {};
    data.professorFirstName = document.getElementById("editfname").value;
    data.professorLastName = document.getElementById("editlname").value;
    data.professorEmail = document.getElementById("editemail").value;
    data.id = document.getElementById("editProfessorid").value;
    
    req.open("POST", "/update-professor", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            console.log("ERROR");
        }
    })

    req.send(JSON.stringify(data));
    document.getElementById("updateProfessor").hidden = true;
}