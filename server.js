const Datastore = require('@google-cloud/datastore')
const projectId = 'cognitive-tasks'

const datastore = new Datastore({
  projectId: projectId,
})

const createNewUser = awsId => {
  const key = datastore.key('User')

  const entity = {
    key,
    data: awsId ? { awsId } : {},
  }

  return datastore.insert(entity).then(() => key)
}

const getOrCreate = (req, res) => {
  if (!req.body.awsId) {
    createNewUser().then(key =>
      res.json({
        userId: key.id,
        status: 'new',
      })
    )
  } else {
    const query = datastore
      .createQuery('User')
      .filter('awsId', '=', req.body.awsId)

    datastore.runQuery(query).then(data => {
      if (data[0].length > 0) {
        res.json({
          userId: data[0][0][Datastore.KEY].id,
          status: 'existing',
        })
      } else {
        createNewUser(req.body.awsId).then(key => {
          res.json({
            userId: key.id,
            status: 'new',
          })
        })
      }
    })
  }
}

module.exports = {
  getOrCreate,
}
