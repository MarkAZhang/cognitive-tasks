import cx from 'classnames'
import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { wasAnswerCorrect } from '~/utils/digits/score'
import ActionManager from '~/utils/actionManager'

import cs from './styles.css'

export default class LevelUpState extends Component {
  state = {
    nextStage: false,
    gameOver: false,
  }

  componentWillMount() {
    const answerCorrect = wasAnswerCorrect(this.props.currentStage)

    const nextStage = answerCorrect
    const gameOver = !answerCorrect

    this.setState({
      nextStage,
      gameOver,
    })

    if (gameOver) {
      this.props.endSession()
    }
  }


  onStart = () => {
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

  render() {
    return (
      <div className={cs.levelUpState}>
      {this.state.nextStage &&
        <div className={cs.nextStage}>
          The test will now get harder.
        </div>
      }
      {this.state.gameOver &&
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
          {this.state.gameOver
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
