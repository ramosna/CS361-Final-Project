// event listeners for the buttons
document.getElementById("convert").addEventListener("click", displayConversion);
document.getElementById("pinButton").addEventListener("click", displayPinEnter);
document.getElementById("add").addEventListener("click", finishPin);
document.getElementById("cancel").addEventListener("click", cancelPin);
document.getElementById("remove").addEventListener("click", hidePin);

// function to display conversion data
function displayConversion(){
    document.getElementById("conversion").style.display = "block";
}
// function to display pin menu
function displayPinEnter(){
    document.getElementById("pinEnter").style.display = "block";
    document.getElementById("pinButton").style.display = "none";
}

// function to display new pinned exchange
function finishPin() {
    document.getElementById("pinButton").style.display = "block";
    document.getElementById("pinEnter").style.display = "none";
    document.getElementById("pinBoard").style.display = "block";
}
// function to cancel a pinned exchange
function cancelPin() {
    document.getElementById("pinButton").style.display = "block";
    document.getElementById("pinEnter").style.display = "none";
}
// function remove a pin
function hidePin() {
    let result = confirm("Are you sure you want to remove this pinned currency conversion?")
    console.log(result)
    if (result == true){
        document.getElementById("pinBoard").style.display = "none";
    }
    
}