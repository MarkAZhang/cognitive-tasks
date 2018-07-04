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

  return key
}

const getOrCreate = async (req, res) => {
  if (!req.body.awsId) {
    const userKey = await createNewUser()
    res.json({
      userId: userKey.id,
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
      const userKey = await createNewUser(req.body.awsId)
      res.json({
        userId: userKey.id,
        status: 'new',
      })
    }
  }
}

module.exports = {
  getOrCreate,
}
