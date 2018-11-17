import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import http from 'http'
import https from 'https'
import fs from 'fs'
import 'babel-polyfill'

import {
  getOrCreate, logSession, getAllUsers,
  getNBackSessions, getDigitsSessions, getReactionSessions,
  getTestID,
} from './endpoints'

var app = express()

const PATH_DIST = path.resolve(__dirname, '../frontend-dist')
const PATH_DIST_CHALLENGE = path.resolve(__dirname, '../challenge')

app.use('/static', express.static(PATH_DIST))
app.use('/.well-known/acme-challenge', express.static(PATH_DIST_CHALLENGE))

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

  console.log('Listening at port 80(HTTP) and port 443(HTTPS)!')

  const privateKey = fs.readFileSync(path.resolve(__dirname, '../ssl/privkey.pem'), 'utf8')
  const certificate = fs.readFileSync(path.resolve(__dirname, '../ssl/cert.pem'), 'utf8')
  const ca = fs.readFileSync(path.resolve(__dirname, '../ssl/chain.pem'), 'utf8')

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca,
  }

  // Starting both http & https servers
  const httpServer = http.createServer(app)
  const httpsServer = https.createServer(credentials, app)

  httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80')
  })

  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443')
  })
} else {
  console.log('Listening at port 8888!')
  app.listen(8888)
}
