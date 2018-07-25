import PropTypes from 'prop-types'

const Action = PropTypes.shape({
  type: PropTypes.oneOf(['answer', 'action']).isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  ms: PropTypes.number,
  metadata: PropTypes.objectOf(PropTypes.any),
})

const Stage = PropTypes.shape({
  metadata: PropTypes.objectOf(PropTypes.any),
  actions: PropTypes.arrayOf(Action),
})

const TaskVars = PropTypes.objectOf(PropTypes.any)

const UserMetadata = PropTypes.shape({
  testId: PropTypes.string,
  age: PropTypes.string,
  gender: PropTypes.string,
})

const SessionRecord = PropTypes.shape({
  type: PropTypes.oneOf(['nback']),
  startTime: PropTypes.instanceOf(Date),
  endTime: PropTypes.instanceOf(Date),
  stages: PropTypes.arrayOf(Stage),
})

const taskData = PropTypes.shape({
  taskVars: TaskVars,
  userMetadata: UserMetadata,
  sessionRecord: SessionRecord,
})

const propTypes = {
  ...PropTypes,
  taskVars: TaskVars,
  userMetadata: UserMetadata,
  sessionRecord: SessionRecord,
  stage: Stage,
  taskData,
}

export default propTypes
