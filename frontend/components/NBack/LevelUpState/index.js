import cx from 'classnames'
import { Component } from 'react'
import { set, concat } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import { calculateAnswerAccuracy, getAnswerBreakdown } from '~/utils/nback/score'
import ActionManager from '~/utils/actionManager'

import { TEST_NUMBER, MAX_WRONG, MAX_CORRECT } from '../constants'

import cs from './styles.css'

export default class LevelUpState extends Component {
  state = {
    stage: 0,
    nextStage: false,
    gameOver: false,
    acc: null,
  }

  componentWillMount() {
    ActionManager.reset()
    const breakdown = getAnswerBreakdown(this.props.currentStage)

    const nextStage = breakdown.correctPositiveAnswers.length >= MAX_CORRECT && !this.props.taskVars.isPractice
    const gameOver = !nextStage && !this.props.taskVars.isPractice

    this.setState({
      acc: parseInt(100 * calculateAnswerAccuracy(this.props.currentStage)),
      nextStage,
      gameOver,
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
      if (this.state.nextStage) {
        // Increase n.
        this.props.updateTaskVars({
          n: this.props.taskVars.n + 1
        })
      }

      if (!this.state.gameOver) {
        const newActionEntry = ActionManager.getActionEntry('action', {
          actionType: 'getting_harder',
        })
        this.props.appendAction(newActionEntry)

        this.props.switchState('instruction')
      } else {
        // Reset data
        this.props.reset()
        this.props.switchState('title')
      }
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
                Your accuracy on this stage was
              </div>
              <div className={cs.accuracy}>
                {this.state.acc}%
              </div>
            </div>
          </div>
        }
        {this.state.stage === 1 && this.state.nextStage &&
          <div className={cs.nextStage}>
            The test will now get harder.
          </div>
        }
        {this.state.stage === 1 && !this.state.nextStage && !isPractice &&
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
            {this.state.stage === 1 && !this.state.nextStage && !isPractice
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
