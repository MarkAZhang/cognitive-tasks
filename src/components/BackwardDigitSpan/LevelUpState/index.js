import cx from 'classnames'
import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import { calculateAccuracyForN } from '~/utils/nback/score'

import cs from './styles.css'

export default class LevelUpState extends Component {
  LevelUpState
  state = {}

  componentWillMount() {
    // Increase n.
    this.props.updateTaskData({
      n: this.props.taskData.n + 1
    })
  }

  onStart = () => {
    this.props.switchState('instruction')
  }

  render() {
    return (
      <div className={cs.levelUpState}>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n - 1}</div>
        <div className={cs.label}>
          Let's change it up a bit...
        </div>
        <div className={cs.startContainer}>
          <div className={cs.startButton} onClick={this.onStart}>Continue</div>
        </div>
      </div>
    )
  }
}

LevelUpState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
