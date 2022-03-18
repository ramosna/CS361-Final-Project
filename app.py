# Troy Peele's microservice used in my project

from flask import *

from urllib.request import urlretrieve
import requests, json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# getting google share price
def polygon_request():
    response = requests.get('https://api.polygon.io/v2/aggs/ticker/GOOG/prev?adjusted=true&apiKey=SuaIlAqCImCfcixB2Qn3FBuZP1mkqkfl')
    text = response.text
    data = json.loads(text)
    stockInfo = data['results'][0]['c']
    print(stockInfo)
    return stockInfo

# route to handle request
@app.route('/amount/', methods=['GET'])
def stock_quantity():
    currentPrice = polygon_request()

    userQuery = int(request.args.get('amount'))

    totalStock = int(userQuery // currentPrice)
    json_dump = json.dumps({'quantity': f'{totalStock}'})
    return json_dump


if __name__ == '__main__':
    app.run()
