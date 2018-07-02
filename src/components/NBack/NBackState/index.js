import cx from 'classnames'
import { concat, filter } from 'lodash/fp'
import { Component } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'
import { generateShapes } from '~/utils/shapes'
import getAnimationClassNames from '~/utils/animation'
import { getCurrentNBreakdown } from '~/utils/score'

import cs from './styles.css'

const TEST_NUMBER = 1000

const MAX_WRONG = 3
const MAX_CORRECT = 5

export default class NBackState extends Component {
  state = {
    testShapes: generateShapes(this.props.taskData.n, TEST_NUMBER),
    index: 0,
  }

  componentWillReceiveProps(nextProps) {
    const breakdown = getCurrentNBreakdown(nextProps.taskData.userAnswers, nextProps.taskData.n)

    if (breakdown.wrongAnswers.length >= MAX_WRONG) {
      nextProps.switchState('end')
      return
    }

    if (breakdown.correctPositiveAnswers.length >= MAX_CORRECT) {
      nextProps.switchState('levelup')
      return
    }

    this.setState({
      index: breakdown.currentNAnswers.length,
    })
  }

  select = yes => {
    let correctAnswer = false

    if (this.state.index >= this.props.taskData.n) {
      correctAnswer =  (this.state.testShapes[this.state.index] === this.state.testShapes[this.state.index - this.props.taskData.n])
    }

    const newAnswerEntry = {
      shape: this.state.testShapes[this.state.index],
      userAnswer: yes ? 'yes': 'no',
      correctAnswer: correctAnswer ? 'yes' : 'no',
      n: this.props.taskData.n,
      index: this.state.index,
      // Add timer
    }

    this.props.updateTaskData({
      userAnswers: concat(this.props.taskData.userAnswers, newAnswerEntry),
    })
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n}</div>
        <div className={cs.currentShapeContainer}>
          <TransitionGroup className={cs.animationGroup}>
            <CSSTransition
              key={this.state.index}
              timeout={{
                enter: 600,
                exit: 200
              }}
              classNames={getAnimationClassNames('shapeAnimation', cs)}
            >
              <Icon glyph={this.state.testShapes[this.state.index]} className={cs.currentShape} />
            </CSSTransition>
          </TransitionGroup>
        </div>
        <TransitionGroup className={cs.controlsAnimationGroup}>
          {this.state.index >= this.props.taskData.n
            ? <CSSTransition
              key='normalControls'
              timeout={{
                enter: 600,
                exit: 200
              }}
              classNames={getAnimationClassNames('controlsAnimation', cs)}
            >
              <div className={cs.controls}>
                <div className={cs.button} onClick={() => this.select(false)}>
                  <Icon glyph='no' className={cs.noIcon} />
                </div>
                <div className={cs.button} onClick={() => this.select(true)}>
                  <Icon glyph='yes' className={cs.yesIcon} />
                </div>
              </div>
            </CSSTransition>
            : <CSSTransition
              key='startControls'
              timeout={{
                enter: 600,
                exit: 200
              }}
              classNames={getAnimationClassNames('controlsAnimation', cs)}
            >
              <div className={cs.controls}>
                <div className={cx(cs.button, cs.nextButton)} onClick={() => this.select(true)}>
                  <span className={cs.nextLabel}>Next</span>
                </div>
              </div>
            </CSSTransition>
          }
        </TransitionGroup>
      </div>
    )
  }
}

NBackState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
