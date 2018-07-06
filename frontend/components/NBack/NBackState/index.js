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
import { getAnswerBreakdown } from '~/utils/nback/score'
import getAnimationClassNames from '~/utils/animation'
import ActionManager from '~/utils/actionManager'

import { TEST_NUMBER, MAX_WRONG, MAX_CORRECT } from '../constants'

import cs from './styles.css'

export default class NBackState extends Component {
  state = {
    testShapes: generateShapes(this.props.taskVars.n, TEST_NUMBER),
    index: 0,
  }

  componentWillReceiveProps(nextProps) {
    const breakdown = getAnswerBreakdown(nextProps.currentStage)

    if (breakdown.wrongAnswers.length >= MAX_WRONG ||
      breakdown.correctPositiveAnswers.length >= MAX_CORRECT
    ) {
      nextProps.switchState('levelup')
      return
    }

    this.setState({
      index: breakdown.scorableAnswers.length + breakdown.firstShapeActions.length,
    })
    ActionManager.reset()
  }

  select = yes => {
    let newActionEntry = null
    const msAdj = this.state.index === 0 ? 0 : 400

    if (this.state.index >= this.props.taskVars.n) {
      const correctAnswer =  (this.state.testShapes[this.state.index] === this.state.testShapes[this.state.index - this.props.taskVars.n])

      newActionEntry = ActionManager.getActionEntry('answer', {
        shape: this.state.testShapes[this.state.index],
        userAnswer: yes ? 'yes': 'no',
        correctAnswer: correctAnswer ? 'yes' : 'no',
        userWasCorrect: yes === correctAnswer ? 'yes' : 'no',
        index: this.state.index,
      })
    } else {
      newActionEntry = ActionManager.getActionEntry('action', {
        actionType: 'first_shapes',
        index: this.state.index,
      })
    }

    this.props.appendAction(newActionEntry)
  }

  render() {
    const isPractice = this.props.taskVars.isPractice
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Stage {this.props.taskVars.n} {isPractice && '(Practice)'}</div>
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
          {this.state.index >= this.props.taskVars.n
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
  appendAction: PropTypes.func.isRequired,
  currentStage: PropTypes.stage,
  taskVars: PropTypes.taskVars,
}
