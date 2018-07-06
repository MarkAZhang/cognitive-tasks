import cx from 'classnames'
import { Component } from 'react'
import { set, concat } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import { logUserSession } from '~/utils/endpoints'
import { calculateAccuracyForN, getCurrentNBreakdown } from '~/utils/nback/score'
import ActionManager from '~/utils/actionManager'

import { TEST_NUMBER, MAX_WRONG, MAX_CORRECT } from '../constants'

import cs from './styles.css'

export default class LevelUpState extends Component {
  LevelUpState
  state = {
    stage: 0,
    nextStage: false,
    acc: null,
  }

  componentWillMount() {
    ActionManager.reset()
    const breakdown = getCurrentNBreakdown(
      this.props.taskData.currentSession.actions, this.props.taskData.n
    )

    this.setState({
      acc: parseInt(100 * calculateAccuracyForN(
        this.props.taskData.currentSession.actions, this.props.taskData.n)
      ),
    })

    const nextStage = breakdown.correctPositiveAnswers.length >= MAX_CORRECT

    if (nextStage) {
      // Increase n.
      this.props.updateTaskData({
        n: this.props.taskData.n + 1
      })
      this.setState({
        nextStage,
      })
    } else if (!this.props.taskData.isPractice) {
      const currentSession = set('endTime', new Date,
        this.props.taskData.currentSession
      )

      this.props.updateTaskData({
        currentSession,
      })

      // Send session to server.
      logUserSession(
        this.props.taskData.userMetadata.serverId,
        currentSession,
      )
    }
  }

  onStart = () => {
    if (this.state.stage === 0) {
      this.setState({
        stage: 1,
      })

      const newActionEntry = ActionManager.getActionEntry('action', {
        actionType: 'feedback',
        n: this.props.taskData.n - 1,
      })

      this.props.setTaskData('currentSession.actions',
        concat(this.props.taskData.currentSession.actions, newActionEntry),
      )
    } else {
      if (this.state.nextStage) {
        const newActionEntry = ActionManager.getActionEntry('action', {
          actionType: 'getting_harder',
          n: this.props.taskData.n - 1,
        })

        this.props.setTaskData('currentSession.actions',
          concat(this.props.taskData.currentSession.actions, newActionEntry),
        )
        this.props.switchState('instruction')
      } else {
        const isPractice = this.props.taskData.isPractice

        if (this.props.taskData.isPractice) {
          this.props.updateTaskData({
            isPractice: false,
          })
          this.props.switchState('instruction')
        } else {
          // Reset data
          this.props.updateTaskData({
            n: 1,
            currentSession: {},
            isPractice: false,
          })
          this.props.switchState('title')
        }
      }
    }
  }

  render() {
    const isPractice = this.props.taskData.isPractice

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
        {this.state.stage === 1 && !this.state.nextStage && isPractice &&
          <div className={cs.endOfTest}>
            <div className={cs.instruction}>
              This concludes the practice session.
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
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
