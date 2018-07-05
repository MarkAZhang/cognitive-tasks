import PropTypes from 'prop-types'

const taskData = PropTypes.shape({
  n: PropTypes.number,
  userMetadata: PropTypes.shape({
    serverId: PropTypes.string,
    awsId: PropTypes.string,
  }),
  currentSession: PropTypes.shape({
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    type: PropTypes.oneOf(['nback']),
    actions: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['answer', 'action']).isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
      ms: PropTypes.number,
      /* answer properties */
      shape: PropTypes.string,
      userAnswer: PropTypes.string,
      correctAnswer: PropTypes.string,
      n: PropTypes.number,
      index: PropTypes.number,
      /* action properties */
      actionType: PropTypes.string,
      n: PropTypes.number,
    })),
  })
})

const propTypes = {
  ...PropTypes,
  taskData,
}

export default propTypes
