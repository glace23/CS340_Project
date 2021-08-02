function checkString(){
    let checkcoursename = document.getElementById("coursename").value;
    let checkstart = document.getElementById("coursestart").value;
    let checkend = document.getElementById("courseend").value;
    let checkroomnumber = document.getElementById("roomnumber").value;
    let checkprofessorfname = document.getElementById("professorfname").value;
    let checkprofessorlname = document.getElementById("professorlname").value;
    let search = '';

    if (checkcoursename !== ''){
        search = search.concat(" Course name:");
        search = search.concat(checkcoursename);
    }
    if (checkstart !== ''){
        search = search.concat(" Start Date:");
        search = search.concat(checkstart);
    }
    if (checkend !== ''){
        search = search.concat(" End Date:");
        search = search.concat(checkend);
    }
    if (checkroomnumber !== ''){
        search = search.concat(" Room Number:");
        search = search.concat(checkroomnumber);
    }
    if (checkprofessorfname !== ''){
        search = search.concat(" Professor First name:");
        search = search.concat(checkprofessorfname);
    }
    if (checkprofessorlname !== ''){
        search = search.concat(" Professor Last name:");
        search = search.concat(checkprofessorlname);
    }
    if (search === ''){
        search = "All fields were left blank";
        document.getElementById("searchvalue").innerHTML = search;
        return false;
    }
    document.getElementById("searchvalue").innerHTML = search;
    return false;
}

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