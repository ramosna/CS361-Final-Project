// variable to keep track of how many pinned exchanges there are
let pinned = 0;

// ticker symbols for currencies
const symbols = {'USD': '$', 'GBP': '£', 'EUR': '€', 'CAD': '$', 'JPY': '¥'}

// event listeners for the buttons
document.getElementById("convert").addEventListener("click", displayConversion);
document.getElementById("pinButton").addEventListener("click", displayPinEnter);
document.getElementById("add").addEventListener("click", pinExchange);
document.getElementById("cancel").addEventListener("click", cancelPin);
document.getElementById("pinHere").addEventListener("click", (event) => {
    if (event.target.name == "remove"){
        deleteConfirm(event)
    }
})

// SECTION 1: functions that delete a pinned exchange

// function for deleting a pinned exchange
function deleteConfirm(event){
    let result = confirm("Are you sure you want to remove this pinned currency conversion?")
    if (result == true){
        let parent = event.target.parentElement;
        parent = parent.parentElement
        const children = parent.children
        removeChildChildren(children)
        removeParentChildren(parent, children)
        removeCard(parent)
    }
}

// function to remove all child elements of children
function removeChildChildren(children){
    for (let i = 0; i < children.length; i++){
        let child = children[i]
        child.removeChild(child.firstElementChild)
    }
}

// function to remove all child elements of parent
function removeParentChildren(parent, children){
    for (let i = 0; i < children.length; i++){
        let child = children[i]
        parent.removeChild(child)
    }
}

// function to remove the last two elements making up the card
function removeCard(parent){
    parent = parent.parentElement
        parent.removeChild(parent.firstElementChild)
        const last = parent
        parent = parent.parentElement
        parent.removeChild(last)
        pinned -= 1
        if (pinned == 0) {
            document.getElementById("pinBoard").style.display = "none";
        }
}

// SECTION 2: functions that call currency API

// function used to get standard currency conversion and google shares
function callApi(currency1, currency2, num){
    // fetching backend api
    fetch("http://localhost:8487/standard/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            one: currency1,
            two: currency2,
            amount: num
        })
    })
        .then(data => data.json())
        .then(data => {
            dataString(data)
        })
}

// function used take conversion data and display it on web page
function dataString(data){
    let amount = data.amount;
    amount += ' '
    amount += data.one
    document.getElementById("begamount").innerHTML = amount;

    let end = data.conv
    end += ' '
    end += data.two
    document.getElementById("endamount").innerHTML = end;
    document.getElementById("shares1").innerHTML = `With ${data.conv} ${data.two} You Could Purchase`;
    googleString(data.shares.quantity);
    
    document.getElementById("conversion").style.display = "block";
}

// function taking google share data and displaying it to web page
function googleString(shareGoogle){
    if (shareGoogle == '1'){
        document.getElementById("shares2").innerHTML = `1 Google Share`;
    }
    else {
        document.getElementById("shares2").innerHTML = `${shareGoogle} Google Shares`;
    }
}

// SECTION 3: functions for building pinned exchange

// function used to make api call for pinned exchange
function getRate(curr1, curr2, dict) {
    fetch("http://localhost:8487/rate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            one: curr1,
            two: curr2
        })
    })
        .then(data => data.json())
        .then(data => {
            buildPin(dict, curr1, curr2, data.conv)
        })
}

// function to build html elements in order to display pin
function buildPin(dict, curr1, curr2, rate) {
    const parent = document.getElementById("pinHere")
    // creating each element to display pin
    const card = createCard()
    const row = createRow()
    const col1 = createCol()
    const col2 = createCol()
    const col3 = createCol()
    const col4 = createCol()
    const button = createButton()

    // appending text to each section
    const display1 = document.createElement("h5")
    display1.innerHTML = `${dict[curr1]} ${curr1} to ${dict[curr2]} ${curr2}`
    col1.append(display1)

    const display2 = document.createElement("h5")
    display2.innerHTML = '='
    col2.append(display2)

    const display3 = document.createElement("h5")
    display3.innerHTML = `Exchange Rate: ${rate}`
    col3.append(display3)

    // appending each element to the parent element
    col4.append(button)
    row.append(col1)
    row.append(col2)
    row.append(col3)
    row.append(col4)
    card.append(row)
    parent.append(card)
}

// function used to create html element card
function createCard() {
    const card = document.createElement("div")
    card.classList.add('card')
    card.classList.add('border-dark')
    card.classList.add('mt-2')
    card.classList.add('mb-2')
    return card
}

// function used to create html element row
function createRow() {
    const row = document.createElement("div")
    row.classList.add('row')
    row.classList.add('mt-2')
    row.classList.add('mb-3')
    return row
}

// function used to create html element column
function createCol() {
    const col = document.createElement("div")
    col.classList.add('col')
    col.classList.add('text-center')
    col.classList.add('mt-4')
    col.classList.add('mx-auto')
    return col
}

// function used to create html element remove button
function createButton(){
    const button = document.createElement("button")
    button.type = "submit"
    button.classList.add("btn")
    button.classList.add("btn-danger")
    button.name = "remove"
    button.innerHTML = 'Remove'
    return button
}

// SECTION 4: functions that hide or display html elements

// function to display conversion data
function displayConversion(){
    const val1 = document.getElementById("currency1").value;
    const val2 = document.getElementById("currency2").value;
    const number = document.getElementById("amount1").value;
    callApi(val1, val2, number)
}

// function to display pin menu
function displayPinEnter(){
    document.getElementById("pinEnter").style.display = "block";
    document.getElementById("pinButton").style.display = "none";
}

// function to cancel a pinned exchange
function cancelPin() {
    document.getElementById("pinButton").style.display = "block";
    document.getElementById("pinEnter").style.display = "none";
}

// function to display new pinned exchange
function pinExchange() {
    const one = document.getElementById("curr1").value;
    const two = document.getElementById("curr2").value;
    getRate(one, two, symbols);
    if (pinned == 0){
        document.getElementById("pinBoard").style.display = "block";
    }
    document.getElementById("pinEnter").style.display = "none";
    document.getElementById("pinButton").style.display = "block";
    pinned += 1
    
}