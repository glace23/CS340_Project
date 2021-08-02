// toggle room look up form
function showRoomLookup(){
    lookup_form = document.getElementById("room-lookup");
    add_form = document.getElementById("room-add");
    if (window.getComputedStyle(lookup_form).display == "none"){
        if (window.getComputedStyle(add_form).display != "none"){
            add_form.hidden = true;
        }
        lookup_form.hidden = false;
    } else {
        lookup_form.hidden = true;
    }
}

// toggle add room form
function showRoomAdd(){
    lookup_form = document.getElementById("room-lookup");
    add_form = document.getElementById("room-add");
    if (window.getComputedStyle(add_form).display == "none"){
        if (window.getComputedStyle(lookup_form).display != "none"){
            lookup_form.hidden = true;
        }
        add_form.hidden = false;
    } else {
        add_form.hidden = true;
    }
}

// delete room using delete button
function deleteRoom(roomID){
    var req = new XMLHttpRequest();
    var data = {};
    data.id = roomID;
    
    req.open("POST", "/delete-room", true);
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

let addRoomButton = document.getElementById("addRoom");
let roomNumberAdd = document.getElementById("roomNumberAdd");
addRoomButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    // place room number in dictionary
    var req = new XMLHttpRequest();
    var data = {};
    data.roomNumber = roomNumberAdd.value;

    req.open("POST", "/insert-room", true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            window.location.reload();
        } else {
            alert("Error adding room.");
        }
    })
    req.send(JSON.stringify(data));
});
