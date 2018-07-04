import PropTypes from 'prop-types'

const taskData = PropTypes.shape({
  n: PropTypes.number,
  userMetadata: PropTypes.shape({
    id: PropTypes.string,
  }),
  currentSession: PropTypes.shape({
    startTime: PropTypes.instanceOf(Date),
    endTime: PropTypes.instanceOf(Date),
    actions: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['answer', 'click']).isRequired,
      timestamp: PropTypes.instanceOf(Date).isRequired,
      /* answer properties */
      shape: PropTypes.string,
      userAnswer: PropTypes.string,
      correctAnswer: PropTypes.string,
      n: PropTypes.number,
      index: PropTypes.number,
      /* click properties */
      message: PropTypes.string,
    })),
  })
})

const propTypes = {
  ...PropTypes,
  taskData,
}

export default propTypes
