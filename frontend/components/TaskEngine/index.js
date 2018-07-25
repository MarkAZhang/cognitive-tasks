import { Component } from 'react'
import { assign, set, get, update, merge, concat, isFunction, isEmpty } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { logSession, userSignIn } from '~/utils/endpoints'

import cs from './styles.css'

class TaskEngine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentState: props.startState,
      currentStage: null,
      taskData: null,
    }
  }

  componentWillMount() {
    this.reset()
  }

  reset = () => {
    this.setState(prevState => ({
      taskData: {
        taskVars: this.props.initialTaskVars,
        sessionRecord: {},
        userMetadata: get('taskData.userMetadata', prevState) || {
          testId: null,
          age: null,
          gender: null,
        },
      },
    }))
  }

  updateUserMetadata = userMetadata => {
    this.setState(prevState => ({
      taskData: merge(prevState.taskData, { userMetadata }),
    }))
  }

  updateTaskVars = taskVars => {
    this.setState(prevState => ({
      taskData: merge(prevState.taskData, { taskVars }),
    }))
  }

  startNewSession = type => {
    this.updateTaskData('sessionRecord', {
      type,
      startTime: new Date(),
      endTime: null,
      stages: [],
    })
    this.setState({
      currentStage: null,
    })
  }

  shouldStartNewSession = () =>
    isEmpty(this.state.taskData.sessionRecord) || this.state.taskData.sessionRecord.endTime !== null

  endSession = () => {
    if (this.state.currentStage) {
      this.updateTaskData('sessionRecord.stages', stages => concat(stages, this.state.currentStage))
    }

    this.updateTaskData('sessionRecord.endTime', new Date())

    this.setState({
      currentStage: null,
    })

    this.logUserSession()
  }

  logUserSession = () => {
    this.setState({}, () => {
      logSession(
        merge(this.state.taskData.sessionRecord, this.state.taskData.userMetadata)
      )
    })
  }

  startNewStage = metadata => {
    if (this.state.currentStage) {
      this.updateTaskData('sessionRecord.stages', stages => concat(stages, this.state.currentStage))
    }

    const newStage = {
      metadata,
      actions: [],
    }

    this.setState({
      currentStage: newStage,
    })
  }

  updateCurrentStageMetadata = metadata => {
    this.setState(prevState => ({
      currentStage: merge(prevState.currentStage, { metadata })
    }))
  }

  appendAction = actionEntry => {
    this.setState(prevState =>
      update('currentStage.actions', actions => concat(actions, actionEntry),
      prevState)
    )
  }

  switchState = newState => {
    this.setState({
      currentState: newState,
    })
  }

  updateTaskData = (path, newData) => {
    this.setState(prevState => {
      const newTaskData = isFunction(newData)
        ? update(path, newData, prevState.taskData)
        : set(path, newData, prevState.taskData)

      return ({
        taskData: newTaskData,
      })
    })
  }

  render() {
    const CurrentState = this.props.taskStates[this.state.currentState]

    return (
      <div className={cs.taskEngineContainer}>
        <CurrentState
          switchState={this.switchState}
          reset={this.reset}
          updateUserMetadata={this.updateUserMetadata}
          startNewSession={this.startNewSession}
          shouldStartNewSession={this.shouldStartNewSession}
          endSession={this.endSession}
          startNewStage={this.startNewStage}
          updateCurrentStageMetadata={this.updateCurrentStageMetadata}
          appendAction={this.appendAction}
          updateTaskVars={this.updateTaskVars}
          taskVars={get('taskVars', this.state.taskData)}
          userMetadata={get('userMetadata', this.state.taskData)}
          currentStage={this.state.currentStage}
        />
      </div>
    )
  }
}

TaskEngine.propTypes = {
  taskStates: PropTypes.objectOf(PropTypes.any),
  startState: PropTypes.string,
  initialTaskVars: PropTypes.objectOf(PropTypes.any),
}

export default TaskEngine
