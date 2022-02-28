// setting the port number
const port = 8487;

const express = require('express');
const app = express();
var CORS = require('cors');
const axios = require('axios');
const res = require('express/lib/response');
const { response } = require('express');


// JSON and form processing
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(CORS());


// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });


function apiCall() {
  return axios.get('https://freecurrencyapi.net/api/v2/latest?apikey=c57339d0-9018-11ec-ab39-910d5ad288fe')
        .then(res => {
            // handle success
            const response = res.data.data
            // console.log(data)
            return response;
        })
        .catch(error => {
            // handle error
            console.log(error);
        })
}

function microCall(dollar) {
  return axios.get(`http://127.0.0.1:5000/amount/?amount=${dollar}`)
  .then(res => {
    // handle success
    const result = res.data
    return result;
})
  .catch(error => {
    // handle error
    console.log(error);
})
}

// post requests to handle new additions to database
app.post('/standard',(req,res,next) => {
  const one = req.body["one"]
  const two = req.body["two"]
  const amount = req.body["amount"]
  const total = {one: one, two: two, amount: amount}
  apiCall()
  .then(response => {
    // console.log(response)
   
    let rate1 = response[one]
    let rate2 = response[two]
    if (rate1 == null){
      rate1 = 1
    }
    if (rate2 == null){
      rate2 = 1
    }
    console.log(rate1)
    console.log(rate2)
    console.log(amount)
    let conversion = ((amount / rate1) * rate2)
    if (conversion < .01) {
      conversion = conversion.toFixed(4)
    }
    else {
      conversion = conversion.toFixed(2)
    }
    const amountGoogle = (amount * rate1).toFixed()
    microCall(amountGoogle)
      .then(response => {
        total.shares = response
        total.conv = conversion
        console.log(total)
        try {res.json(total)}
        catch {console.log("error")}
      })
    
    
  })
  .catch(error => {
    // handle error
    console.log(error);
  })
  });

// post request handling pinned exchanges
app.post('/rate',(req,res,next) => {
  const one = req.body["one"]
  const two = req.body["two"]
  const total = {}
  apiCall()
  .then(response => {
    // console.log(response)
     
    let rate1 = response[one]
    let rate2 = response[two]
    if (rate1 == null){
      rate1 = 1
    }
    if (rate2 == null){
      rate2 = 1
    }
    //console.log(rate1)
    //console.log(rate2)
    //console.log(amount)
    let conversion = rate2 / rate1
    if (conversion < 0.01) {
      conversion = conversion.toFixed(4)
    }
    else {
      conversion = conversion.toFixed(2)
    }
    total.conv = conversion
    try {res.json(total)}
    catch {console.log("error")}
      
  })
  .catch(error => {
    // handle error
    console.log(error);
  })
  });

app.get('/convert', (req, res, next) => {
  const currency = req.query["currency"]
  const amount = req.query["amount"]
  apiCall()
    .then(response => {
      const rate = response[currency]
      const conv = rate * amount;
      const result = {conversion: conv}
      try {res.json(result)}
      catch {console.log("error")}
    })
})

// 400 error handler
app.use((req,res) => {
    res.status(404);
    console.log('400 Error')
    res.send('404');
  });
  
// 500 error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    console.log('500 Error')
    res.send('500');
  });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });