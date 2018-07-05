import cx from 'classnames'
import { concat, filter } from 'lodash/fp'
import { Component } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import { getCurrentNBreakdown } from '~/utils/nback/score'
import getAnimationClassNames from '~/utils/animation'

import { TEST_NUMBER, MAX_WRONG, MAX_CORRECT } from '../constants'

import cs from './styles.css'

export default class NBackState extends Component {
  state = {
    testShapes: generateShapes(this.props.taskData.n, TEST_NUMBER),
    index: 0,
    lastTime: (new Date()).getTime(),
  }

  componentWillReceiveProps(nextProps) {
    const breakdown = getCurrentNBreakdown(
      nextProps.taskData.currentSession.actions, nextProps.taskData.n
    )

    if (breakdown.wrongAnswers.length >= MAX_WRONG ||
      breakdown.correctPositiveAnswers.length >= MAX_CORRECT
    ) {
      nextProps.switchState('levelup')
      return
    }

    this.setState({
      index: breakdown.currentNAnswers.length + breakdown.firstShapeAnswers.length,
      lastTime: (new Date()).getTime(),
    })
  }

  select = yes => {
    let newActionEntry = null
    const newTime = new Date()
    if (this.state.index >= this.props.taskData.n) {
      const correctAnswer =  (this.state.testShapes[this.state.index] === this.state.testShapes[this.state.index - this.props.taskData.n])

      newActionEntry = {
        type: 'answer',
        timestamp: newTime,
        ms: newTime.getTime() - this.state.lastTime,
        shape: this.state.testShapes[this.state.index],
        userAnswer: yes ? 'yes': 'no',
        correctAnswer: correctAnswer ? 'yes' : 'no',
        userWasCorrect: yes === correctAnswer ? 'yes' : 'no',
        n: this.props.taskData.n,
        index: this.state.index,
      }
    } else {
      newActionEntry = {
        type: 'action',
        timestamp: newTime,
        ms: newTime.getTime() - this.state.lastTime,
        actionType: 'first_shapes',
        index: this.state.index,
        n: this.props.taskData.n,
      }
    }

    this.props.setTaskData('currentSession.actions',
      concat(this.props.taskData.currentSession.actions, newActionEntry),
    )
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
  setTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
