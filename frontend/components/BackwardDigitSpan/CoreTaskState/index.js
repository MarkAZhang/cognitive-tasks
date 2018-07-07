import { Component } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group'
import { range, set, some } from 'lodash/fp'
import cx from 'classnames'

import getAnimationClassNames from '~/utils/animation'
import PropTypes from '~/utils/propTypes'
import { generateDigits } from '~/utils/digits/digits'
import { Icon, LiteButton } from '~/components'
import ActionManager from '~/utils/actionManager'

import EnteredDigits from './EnteredDigits'
import cs from './styles.css'

const TOTAL_DIGIT_TIME = 1600
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

export default class CoreTaskState extends Component {
  state = {
    testDigits: null,
    index: 0,
    enterDigitMode: false,
    enteredDigits: null,
  }

  componentWillMount() {
    this.reset()
  }

  reset = () => {
    this.setState({
      testDigits: generateDigits(this.props.taskVars.n),
      index: 0,
      enterDigitMode: false,
      enteredDigits: range(0, this.props.taskVars.n).map(() => null),
    })
    setTimeout(this.advanceDigit, TOTAL_DIGIT_TIME)
  }

  advanceDigit = () => {
    const newIndex = this.state.index + 1
    if (newIndex < this.state.testDigits.length) {
      this.setState({
        index: newIndex
      })
      setTimeout(this.advanceDigit, TOTAL_DIGIT_TIME)
    } else {
      this.setState({
        enterDigitMode: true,
      })
      ActionManager.reset()
    }
  }

  enterDigit = digit => {
    if (this.state.index < 0) {
      return
    }

    const newActionEntry = ActionManager.getActionEntry('answer', {
      userAnswer: digit,
      correctAnswer: this.state.testDigits[this.state.index],
      userWasCorrect: digit === this.state.testDigits[this.state.index] ? 'yes' : 'no',
      index: this.state.index,
    })

    this.props.appendAction(newActionEntry)

    this.setState({
      enteredDigits: set(this.state.index, digit, this.state.enteredDigits),
      index: this.state.index - 1
    })
  }

  onContinue = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'confirm_feedback',
      index: this.state.index,
    })

    this.props.appendAction(newActionEntry)

    this.props.switchState('levelup')
  }

  repeatPractice = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'repeat_practice',
      index: this.state.index,
    })
    this.props.appendAction(newActionEntry)
    this.props.startNewStage({
      n: this.props.taskVars.n,
      isPractice: true,
    })
    this.reset()
  }

  exitPractice = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'exit_practice',
      index: this.state.index,
    })

    this.props.updateTaskVars({
      isPractice: false,
    })

    this.props.appendAction(newActionEntry)
    this.props.switchState('instruction')
  }

  render() {
    const entryComplete = this.state.enterDigitMode && this.state.index === -1
    const isPractice = this.props.taskVars.isPractice
    return (
      <div>
        <div className={cs.levelDisplay}>Stage {this.props.taskVars.n - 1} {isPractice && '(Practice)'}</div>
        <TransitionGroup className={cs.digitAnimationGroup}>
          {!this.state.enterDigitMode &&
            <CSSTransition
              key={this.state.index}
              timeout={{
                enter: 600,
                exit: 200
              }}
              classNames={getAnimationClassNames('digitAnimation', cs)}
              appear
            >
              <div className={cs.digit}>
                <div>{this.state.testDigits[this.state.index]}</div>
              </div>
            </CSSTransition>
          }
        </TransitionGroup>
        {this.state.enterDigitMode &&
          <TransitionGroup>
            <CSSTransition
              key='answers'
              timeout={{
                enter: 600,
                exit: 200
              }}
              classNames={getAnimationClassNames('answerAnimation', cs)}
              appear
            >
              <div className={cs.answerAnimationGroup}>
                {this.state.enterDigitMode &&
                  <EnteredDigits className={cs.blanks} digits={this.state.enteredDigits} boldIndex={this.state.index} />
                }
                {entryComplete &&
                  <div className={cs.answers}>
                    {this.state.testDigits.map((i, index) =>
                      <div className={cs.answer} key={index}>
                        <div className={cs.answerDigit}>
                          {i}
                        </div>
                        {this.state.testDigits[index] == this.state.enteredDigits[index]
                          ? <Icon glyph='yes' className={cs.yesIcon} />
                          : <Icon glyph='no' className={cs.noIcon} />
                        }
                      </div>
                    )}
                  </div>
                }
                {this.state.enterDigitMode && !entryComplete &&
                  <div className={cs.controls}>
                    {DIGITS.map(i =>
                      <div
                        className={cx(cs.button, entryComplete && cs.disabled)}
                        key={i}
                        onClick={() => this.enterDigit(i)}
                      >
                        {i}
                      </div>
                    )}
                  </div>
                }
                {entryComplete && (isPractice
                  ? (
                    <div className={cs.entryCompleteControls}>
                      <LiteButton className={cs.button} onClick={this.exitPractice}>Exit Practice</LiteButton>
                      <LiteButton className={cs.button} onClick={this.repeatPractice}>Try Again</LiteButton>
                    </div>
                  )
                  : (
                    <div className={cs.entryCompleteControls}>
                      <LiteButton onClick={this.onContinue}>Continue</LiteButton>
                    </div>
                  )
                )}
              </div>
            </CSSTransition>
          </TransitionGroup>
        }

      </div>
    )
  }
}

CoreTaskState.propTypes = {
  switchState: PropTypes.func.isRequired,
  appendAction: PropTypes.func.isRequired,
  currentStage: PropTypes.stage,
  taskVars: PropTypes.taskVars,
  startNewStage: PropTypes.func.isRequired,
}
