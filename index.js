var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

var { getOrCreate } = require('./server')

var app = express()

const PATH_DIST = path.resolve(__dirname, 'dist');

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use('/static', express.static(PATH_DIST))

app.get('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
})

console.log('Listening at port 8888!')

app.post('/user/get_or_create', getOrCreate)

app.listen(8888)
