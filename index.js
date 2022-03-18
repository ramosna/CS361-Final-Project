// setting the port number
const port = 8487;

// required dependencies
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


// Idea from https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// used for cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

// GET request to currency api
function apiCall() {
  return axios.get('https://freecurrencyapi.net/api/v2/latest?apikey=c57339d0-9018-11ec-ab39-910d5ad288fe')
        .then(res => {
            const response = res.data.data
            return response;
        })
        .catch(error => {console.log(error)})
}

// GET request to teamates microservice for google shares
function microCall(dollar) {
  return axios.get(`http://127.0.0.1:5000/amount/?amount=${dollar}`)
  .then(res => {
    const result = res.data
    return result;
})
  .catch(error => {console.log(error)})
}

// function for checking if value is null, indicates USD
function checkNull(value) {
  if (value == null){
    value = 1
  }
  return value
}

// function for truncating large float values
function roundConv(value) {
  if (value < .01) {
    value = value.toFixed(4)
  }
  else {
    value = value.toFixed(2)
  }
  return value
}

// route for handling standard currency conversion
app.post('/standard',(req,res,next) => {
  // creating variables for post body data
  const one = req.body["one"]
  const two = req.body["two"]
  const amount = req.body["amount"]
  // object to send response
  const total = {one: one, two: two, amount: amount}
  // calling converter API
  apiCall()
  .then(response => {
    let rate1 = checkNull(response[one])
    let rate2 = checkNull(response[two])
    let conversion = roundConv(((amount / rate1) * rate2))
    const amountGoogle = (amount * rate1).toFixed()
    // calling teamates microservice for google shares
    microCall((amount * rate1).toFixed())
      .then(response => {
        total.shares = response
        total.conv = conversion
        res.json(total)
      })
      .catch(error => {console.log(error)})
  })
  .catch(error => {console.log(error)})
});


// route for handling pinned exchanges
app.post('/rate',(req,res,next) => {
  // creating variables for post body data
  const one = req.body["one"]
  const two = req.body["two"]
  // object to send back
  const total = {}
  // calling currency api
  apiCall()
  .then(response => {
    let rate1 = checkNull(response[one])
    let rate2 = checkNull(response[two])
    let conversion = roundConv(rate2 / rate1)
    total.conv = conversion
    res.json(total)
  })
  .catch(error => {console.log(error)})
  });

// route for converting a currency amount to USD
app.get('/convert', (req, res, next) => {
  const currency = req.query["currency"]
  const amount = req.query["amount"]
  // currency api call
  apiCall()
    .then(response => {
      const rate = response[currency]
      const conv = rate * amount;
      const result = {conversion: conv}
      res.json(result)
    })
    .catch(error => {console.log(error)})
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