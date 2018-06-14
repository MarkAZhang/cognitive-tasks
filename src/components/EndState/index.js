import cx from 'classnames'
import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'
import { generateShapes } from '~/utils/shapes'
import calculateAccuracyForN from '~/utils/score'

import cs from './styles.css'

export default class EndState extends Component {
  state = {}

  componentWillMount() {
    // Send data to server.
  }

  onStart = () => {
    this.props.switchState('title')
  }

  render() {
    return (
      <div className={cs.endState}>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n}</div>
        <div className={cs.scoreDisplay}>
          <div className={cs.label}>
            Your accuracy was
          </div>
          <div className={cs.accuracy}>
            {parseInt(100 * calculateAccuracyForN(
              this.props.taskData.userAnswers, this.props.taskData.n))
            }%
          </div>
        </div>
        <div className={cs.label}>
          Thank you for taking the test!
        </div>
        <div className={cs.startContainer}>
          <div className={cs.startButton} onClick={this.onStart}>Back to Title</div>
        </div>
      </div>
    )
  }
}

EndState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
