import Datastore from '@google-cloud/datastore'

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

module.exports = {
  getOrCreate,
  logUserSession,
}
