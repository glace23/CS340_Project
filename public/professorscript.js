function checkString(){
    let checkfname = document.getElementById("professorfname").value;
    let checklname = document.getElementById("professorlname").value;
    let checkemail = document.getElementById("professoremail").value;
    let checknumber = document.getElementById("professornumber").value;
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
    if (search === ''){
        search = "All fields were left blank";
        document.getElementById("searchvalue").innerHTML = search;
        return false;
    }
    document.getElementById("searchvalue").innerHTML = search;
    return false;
}

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
