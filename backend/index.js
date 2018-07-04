import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import 'babel-polyfill'

import { getOrCreate } from './endpoints'

var app = express()

const PATH_DIST = path.resolve(__dirname, 'dist');

app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use('/static', express.static(PATH_DIST))

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
})

console.log('Listening at port 8888!')

app.post('/user/get_or_create', getOrCreate)

app.listen(8888)
