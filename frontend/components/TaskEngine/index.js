import { Component } from 'react'
import { assign, set } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'

import cs from './styles.css'

class TaskEngine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentState: props.startState,
      taskData: props.startTaskData,
    }
  }

  switchState = newState => {
    this.setState({
      currentState: newState,
    })
  }

  setTaskData = (path, newData) => {
    this.setState({
      taskData: set(path, newData, this.state.taskData),
    })
  }

  updateTaskData = newData => {
    this.setState({
      taskData: assign(this.state.taskData, newData),
    })
  }

  render() {
    const CurrentState = this.props.taskStates[this.state.currentState]

    return (
      <div className={cs.taskEngineContainer}>
        <CurrentState
          switchState={this.switchState}
          updateTaskData={this.updateTaskData}
          setTaskData={this.setTaskData}
          taskData={this.state.taskData}
        />
      </div>
    )
  }
}

TaskEngine.propTypes = {
  taskStates: PropTypes.objectOf(PropTypes.any),
  startState: PropTypes.string,
  startTaskData: PropTypes.taskData,
}

export default TaskEngine
