    // toggle enrollment look up form
    function showEnrollmentLookup(){
        lookup_form = document.getElementById("enrollment-lookup");
        add_form = document.getElementById("enrollment-add");
        if (window.getComputedStyle(lookup_form).display == "none"){
            if (window.getComputedStyle(add_form).display != "none"){
                add_form.hidden = true;
            }
            lookup_form.hidden = false;
        } else {
            lookup_form.hidden = true;
        }
    }

    // toggle enrollment add form
    function showEnrollmentAdd(){
        lookup_form = document.getElementById("enrollment-lookup");
        add_form = document.getElementById("enrollment-add");
        if (window.getComputedStyle(add_form).display == "none"){
            if (window.getComputedStyle(lookup_form).display != "none"){
                lookup_form.hidden = true;
            }
            add_form.hidden = false;
        } else {
            add_form.hidden = true;
        }
    }