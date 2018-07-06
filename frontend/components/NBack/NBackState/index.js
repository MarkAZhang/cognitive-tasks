import cx from 'classnames'
import { concat, filter, last } from 'lodash/fp'
import { Component } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
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
    const isPractice = nextProps.taskVars.isPractice

    if (!isPractice && (
      breakdown.wrongAnswers.length >= MAX_WRONG ||
      breakdown.correctPositiveAnswers.length >= MAX_CORRECT
    )) {
      nextProps.switchState('levelup')
      return
    }

    this.setState({
      index: (isPractice ? breakdown.instantFeedbackActions.length : breakdown.scorableAnswers.length) + breakdown.firstShapeActions.length,
      showFeedback: isPractice && breakdown.scorableAnswers.length > breakdown.instantFeedbackActions.length,
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
      }, msAdj)
    } else {
      newActionEntry = ActionManager.getActionEntry('action', {
        actionType: 'first_shapes',
        index: this.state.index,
      }, msAdj)
    }

    this.props.appendAction(newActionEntry)
  }

  confirmFeedback = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'instant_feedback',
      index: this.state.index,
    })

    this.props.appendAction(newActionEntry)
  }

  exitPractice = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'exit_practice',
      index: this.state.index,
    })

    this.props.appendAction(newActionEntry)
    this.props.switchState('levelup')
  }

  renderFeedback = () => {
    const lastAnswer = last(filter(['type', 'answer'], this.props.currentStage.actions))

    const answerIcon = (
      <Icon
        glyph={lastAnswer.metadata.userAnswer}
        className={cx(cs[lastAnswer.metadata.userAnswer], cs.boxIcon)}
      />
    )

    const correctSpan = lastAnswer.metadata.userWasCorrect === 'yes'
      ? <span className={cs.correct}>Correct</span>
      : <span className={cs.wrong}>Wrong</span>

    const curShape = (
      <Icon
        glyph={this.state.testShapes[this.state.index]}
      />
    )

    const prevShape = (
      <Icon
        glyph={this.state.testShapes[this.state.index - this.props.taskVars.n]}
      />
    )

    const matchesString = lastAnswer.metadata.correctAnswer === 'yes'
      ? 'matches'
      : 'doesn\'t match'

    const shapeString = this.props.taskVars.n === 1
      ? 'the last shape'
      : `the shape ${this.props.taskVars.n} steps ago`

    return (
      <div className={cs.feedback}>
        <div className={cs.text}>
          {answerIcon} is {correctSpan}
        </div>
        <div className={cs.text}>
          <div>The current shape {curShape} {matchesString}</div>
          <div>{shapeString} {prevShape}.</div>
        </div>
        <div className={cx(cs.controls, cs.feedbackControls)}>
          <LiteButton className={cs.feedbackButton} onClick={this.exitPractice}>
            End Practice
          </LiteButton>
          <LiteButton className={cs.feedbackButton} onClick={this.confirmFeedback}>Continue</LiteButton>
        </div>
      </div>
    )
  }

  render() {
    const isPractice = this.props.taskVars.isPractice
    return (
      <div className={cs.coreTaskState}>
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
              {this.state.showFeedback
                ? this.renderFeedback()
                : (
                  <div className={cs.controls}>
                    <div className={cs.button} onClick={() => this.select(false)}>
                      <Icon glyph='no' className={cs.noIcon} />
                    </div>
                    <div className={cs.button} onClick={() => this.select(true)}>
                      <Icon glyph='yes' className={cs.yesIcon} />
                    </div>
                  </div>
                )
              }
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
                <LiteButton onClick={this.select}>Next</LiteButton>
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
