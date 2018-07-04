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
import { Icon } from '~/components'

import cs from './styles.css'

const TOTAL_DIGIT_TIME = 1600
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

export default class CoreTaskState extends Component {
  state = {
    testDigits: generateDigits(this.props.taskData.n),
    index: 0,
    enterDigitMode: false,
    enteredDigits: range(0, this.props.taskData.n).map(() => null),
  }

  componentWillMount() {
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
    }
  }

  enterDigit = digit => {
    if (this.state.index < 0) {
      return
    }
    this.setState({
      enteredDigits: set(this.state.index, digit, this.state.enteredDigits),
      index: this.state.index - 1
    })
  }

  onContinue = () => {
    const anyWrong = some(Boolean, range(0, this.props.taskData.n).map(index =>
      this.state.testDigits[index] !== this.state.enteredDigits[index]
    ))

    if (anyWrong) {
      this.props.switchState('end')
    } else {
      this.props.switchState('levelup')
    }
  }

  render() {
    const entryComplete = this.state.enterDigitMode && this.state.index === -1
    return (
      <div>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n}</div>
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
                  <div className={cs.blanks}>
                    {this.state.enteredDigits.map((i, index) =>
                      <div className={cs.enteredDigit} key={index}>
                        {i}
                      </div>
                    )}
                  </div>
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
                {this.state.enterDigitMode &&
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
                {entryComplete &&
                  <div className={cs.startContainer}>
                    <div className={cs.startButton} onClick={this.onContinue}>Continue</div>
                  </div>
                }
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
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
