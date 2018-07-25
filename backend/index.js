import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import 'babel-polyfill'

import {
  getOrCreate, logSession, getAllUsers,
  getNBackSessions, getDigitsSessions, getReactionSessions,
  getTestID,
} from './endpoints'

var app = express()

const PATH_DIST = path.resolve(__dirname, '../frontend-dist');

app.use('/static', express.static(PATH_DIST))
app.use(bodyParser.json())       // to support JSON-encoded bodies

app.post('/user/get_or_create', getOrCreate)
app.get('/user/all', getAllUsers)
app.get('/sessions/nback', getNBackSessions)
app.post('/sessions/log', logSession)
app.get('/sessions/digits', getDigitsSessions)
app.get('/sessions/reaction', getReactionSessions)
app.get('/api/get_test_id', getTestID)


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
