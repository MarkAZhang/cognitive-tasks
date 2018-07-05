import Datastore from '@google-cloud/datastore'
import { map, mapValues, groupBy, split } from 'lodash/fp'

import { PASSWORD } from '../server-password'

const projectId = 'cognitive-tasks'

const datastore = new Datastore({
  projectId: projectId,
})

const createNewUser = async awsId => {
  const key = datastore.key('User')

  const entity = {
    key,
    data: awsId ? { awsId } : {},
  }

  await datastore.insert(entity)

  return key.id
}

const logNewSession = async (req, userServerId, session) => {
  const key = datastore.key('TestSession')

  const entity = {
    key,
    data: {
      userId: userServerId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...session,
    }
  }

  await datastore.insert(entity)

  return key.id
}

const formatUser = user => ({
  serverId: user[Datastore.KEY].id,
  awsId: user.awsId,
})

const fetchUsers = async () => {

  const query = datastore
      .createQuery('User')

  const response = await datastore.runQuery(query)

  return map(formatUser, response[0])
}

const formatTestSession = session => ({
  ...session,
  serverId: session[Datastore.KEY].id,
})

const fetchTestSessions = async () => {

  const query = datastore
      .createQuery('TestSession')
      .order('startTime', {
        descending: true,
      });

  const response = await datastore.runQuery(query)

  return map(formatTestSession, response[0])
}

const getOrCreate = async (req, res) => {
  if (!req.body.awsId) {
    const userId = await createNewUser()
    res.json({
      userId,
      status: 'new',
    })
    return
  } else {
    const query = datastore
      .createQuery('User')
      .filter('awsId', '=', req.body.awsId)

    const response = await datastore.runQuery(query)
    if (response[0].length > 0) {
      res.json({
        userId: response[0][0][Datastore.KEY].id,
        status: 'existing',
      })
    } else {
      const userId = await createNewUser(req.body.awsId)
      res.json({
        userId,
        status: 'new',
      })
    }
  }
}

const logUserSession = async (req, res) => {
  const sessionId = await logNewSession(req, req.params.userServerId, req.body.session)
  res.json({
    status: 'success',
    sessionId,
  })
}

const getAllUsers = async (req, res) => {
  const auth = split(' ', req.get('authorization'))

  if (auth[1] !== PASSWORD) {
    return res.status(401).send("Authorization Required");
  }

  let userData = await fetchUsers()

  const testSessionData = await fetchTestSessions()

  const counts = mapValues(sessions => sessions.length, groupBy('userId', testSessionData))

  userData = userData.map(data => ({
    ...data,
    numSessions: counts[data.serverId] || 0,
  }))

  res.json({
    users: userData,
  })
}

const getAllTestSessions = async (req, res) => {
  const auth = split(' ', req.get('authorization'))

  if (auth[1] !== PASSWORD) {
    return res.status(401).send("Authorization Required");
  }

  const testSessionData = await fetchTestSessions()

  res.json({
    testSessions: testSessionData,
  })
}

module.exports = {
  getOrCreate,
  logUserSession,
  getAllUsers,
  getAllTestSessions,
}
