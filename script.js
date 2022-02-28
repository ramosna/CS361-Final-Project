
let pinned = 0;

const symbols = {'USD': '$', 'GBP': '£', 'EUR': '€', 'CAD': '$', 'JPY': '¥'}

/*
document.getElementById("testing").addEventListener("click", testFun);
function testFun(){
    fetch("http://localhost:8487/convert?currency=CAD&amount=500")
    .then(data => data.json())
        .then(data => {
            console.log(data)
        })
}
*/

// event listeners for the buttons
document.getElementById("convert").addEventListener("click", displayConversion);
document.getElementById("pinButton").addEventListener("click", displayPinEnter);
document.getElementById("add").addEventListener("click", pinExchange);
document.getElementById("cancel").addEventListener("click", cancelPin);
document.getElementById("pinHere").addEventListener("click", (event) => {
    if (event.target.name == "remove"){
        let result = confirm("Are you sure you want to remove this pinned currency conversion?")
            if (result == true){
            let parent = event.target.parentElement;
            parent = parent.parentElement
            const children = parent.children
            for (let i = 0; i < children.length; i++){
                let child = children[i]
                child.removeChild(child.firstElementChild)
            }
            for (let i = 0; i < children.length; i++){
                let child = children[i]
                parent.removeChild(child)
            }
        
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
    }
})

function callApi(currency1, currency2, num){
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
            console.log(data)
            let amount = data.amount;
            amount += ' '
            amount += data.one
            console.log(amount)
            document.getElementById("begamount").innerHTML = amount;

            let end = data.conv
            end += ' '
            end += data.two
            document.getElementById("endamount").innerHTML = end;
            document.getElementById("shares1").innerHTML = `With ${data.conv} ${data.two} You Could Purchase`;
            const shareGoogle = data.shares.quantity;
            if (shareGoogle == '1'){
                document.getElementById("shares2").innerHTML = `1 Google Share`;
            }
            else {
                document.getElementById("shares2").innerHTML = `${shareGoogle} Google Shares`;
            }


            document.getElementById("conversion").style.display = "block";
        })
}

function buildPin(dict, curr1, curr2, rate) {
    const parent = document.getElementById("pinHere")
    // adding card
    const card = document.createElement("div")
    card.classList.add('card')
    card.classList.add('border-dark')
    card.classList.add('mt-2')
    card.classList.add('mb-2')
    // adding row
    const row = document.createElement("div")
    row.classList.add('row')
    row.classList.add('mt-2')
    row.classList.add('mb-3')
    function createCol() {
        const col = document.createElement("div")
        col.classList.add('col')
        col.classList.add('text-center')
        col.classList.add('mt-4')
        col.classList.add('mx-auto')
        return col
    }
    const col1 = createCol()
    const col2 = createCol()
    const col3 = createCol()
    const col4 = createCol()


    const display1 = document.createElement("h5")
    display1.innerHTML = `${dict[curr1]} ${curr1} to ${dict[curr2]} ${curr2}`
    col1.append(display1)

    const display2 = document.createElement("h5")
    display2.innerHTML = '='
    col2.append(display2)

    const display3 = document.createElement("h5")
    display3.innerHTML = `Exchange Rate: ${rate}`
    col3.append(display3)

    const button = document.createElement("button")
    button.type = "submit"
    button.classList.add("btn")
    button.classList.add("btn-danger")
    button.name = "remove"
    button.innerHTML = 'Remove'
    col4.append(button)

    row.append(col1)
    row.append(col2)
    row.append(col3)
    row.append(col4)

    card.append(row)

    parent.append(card)
}

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
            console.log(data)
            buildPin(dict, curr1, curr2, data.conv)
        })
}

function removePin(event) {
    console.log(even.target.name)
}

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