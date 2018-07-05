import Datastore from '@google-cloud/datastore'
import { map, mapValues, groupBy } from 'lodash/fp'

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

const logNewSession = async (userServerId, session) => {
  const key = datastore.key('TestSession')

  const entity = {
    key,
    data: {
      userId: userServerId,
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
  serverId: session[Datastore.KEY].id,
  userId: session.userId,
})

const fetchTestSessions = async () => {

  const query = datastore
      .createQuery('TestSession')

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
  const sessionId = await logNewSession(req.params.userServerId, req.body.session)
  res.json({
    status: 'success',
    sessionId,
  })
}

const getAllUsers = async (req, res) => {
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

module.exports = {
  getOrCreate,
  logUserSession,
  getAllUsers,
}
