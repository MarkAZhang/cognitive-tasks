import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import 'babel-polyfill'

import { getOrCreate, logUserSession, getAllUsers, getAllTestSessions } from './endpoints'

var app = express()

const PATH_DIST = path.resolve(__dirname, '../frontend-dist');

app.use('/static', express.static(PATH_DIST))
app.use(bodyParser.json())       // to support JSON-encoded bodies

app.post('/user/get_or_create', getOrCreate)
app.post('/user/:userServerId/log_session', logUserSession)
app.get('/user/all', getAllUsers)
app.get('/testsessions/all', getAllTestSessions)


app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../index.html'));
})

if (process.env.NODE_ENV === 'production') {
  console.log('Listening at port 80!')
  app.listen(80)
} else {
  console.log('Listening at port 8888!')
  app.listen(8888)
}
