import { Component } from 'react'
import PropTypes from 'prop-types'

import cs from './styles.css'

class TaskEngine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentState: props.startState,
    }
  }

  render() {
    const CurrentState = this.props.taskStates[this.state.currentState]

    return (
      <div className={cs.taskEngineContainer}>
        <CurrentState />
      </div>
    )
  }
}

TaskEngine.propTypes = {
  taskStates: PropTypes.objectOf(PropTypes.any),
  startState: PropTypes.string,
}

export default TaskEngine
