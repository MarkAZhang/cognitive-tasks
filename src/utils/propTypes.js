import PropTypes from 'prop-types'

const taskData = PropTypes.shape({
  n: PropTypes.number,
  answers: PropTypes.arrayOf(PropTypes.shape({
    shape: PropTypes.string,
    userAnswer: PropTypes.string,
    correctAnswer: PropTypes.string,
    n: PropTypes.number,
    index: PropTypes.number,
  })),
})

const propTypes = {
  ...PropTypes,
  taskData,
}

export default propTypes
