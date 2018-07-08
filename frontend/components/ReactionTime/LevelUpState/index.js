import cx from 'classnames'
import { Component } from 'react'
import { set, concat } from 'lodash/fp'
import { round } from 'lodash'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import { getAvgTime } from '~/utils/reaction/score'
import ActionManager from '~/utils/actionManager'

import cs from './styles.css'

export default class LevelUpState extends Component {
  state = {
    stage: 0,
    gameOver: false,
    avgTime: null,
  }

  componentWillMount() {
    ActionManager.reset()
    const gameOver = !this.props.taskVars.isPractice

    this.setState({
      gameOver,
      avgTime: getAvgTime(this.props.currentStage) / 1000,
    })

    if (gameOver) {
      this.props.endSession()
    }
  }

  onStart = () => {
    const isPractice = this.props.taskVars.isPractice
    if (this.state.stage === 0) {
      if (!this.state.gameOver) {
        const newActionEntry = ActionManager.getActionEntry('action', {
          actionType: 'end_of_stage_feedback',
        })
        this.props.appendAction(newActionEntry)
      }

      if (isPractice) {
        this.props.updateTaskVars({
          isPractice: false,
        })
        this.props.switchState('instruction')
      } else {
        this.setState({
          stage: 1,
        })
      }
    } else {
      // Reset data
      this.props.reset()
      this.props.switchState('title')
    }
  }

  render() {
    const isPractice = this.props.taskVars.isPractice

    return (
      <div className={cs.levelUpState}>
        {this.state.stage === 0 &&
          <div>
            <div className={cs.title}>Test results</div>
            <div className={cs.scoreDisplay}>
              <div className={cs.label}>
                Your average reaction time was
              </div>
              <div className={cs.accuracy}>
                {round(this.state.avgTime, 1)}s
              </div>
            </div>
          </div>
        }
        {this.state.stage === 1 && this.state.gameOver &&
          <div className={cs.endOfTest}>
            <div className={cs.instruction}>
              This concludes the test.
            </div>
            <div className={cs.instruction}>
              Thank you for your participation.
            </div>
          </div>
        }
        <div className={cs.startContainer}>
          <LiteButton className={cs.startButton} onClick={this.onStart}>
            {this.state.stage === 1 && this.state.gameOver
               ? 'Back to Title'
               : 'Continue'
            }
          </LiteButton>
        </div>
      </div>
    )
  }
}

LevelUpState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskVars: PropTypes.func.isRequired,
  endSession: PropTypes.func.isRequired,
  appendAction: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  taskVars: PropTypes.taskVars,
  currentStage: PropTypes.stage,
}
