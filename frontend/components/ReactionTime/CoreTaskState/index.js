import { Component } from 'react'
import { random } from 'lodash/fp'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PropTypes from '~/utils/propTypes'
import Icon from '~/components/Icon'
import ActionManager from '~/utils/actionManager'
import getAnimationClassNames from '~/utils/animation'

import cs from './styles.css'

const NUM_ROUNDS = 10
const NUM_ROUNDS_PRACTICE = 3
const getRandomTime = () => random(1000, 4000)

export default class CoreTaskState extends Component {
  state = {
    index: 0,
    currentState: 'waiting',
  }

  _timeout = null

  componentWillMount() {
    this._timeout = setTimeout(this.appear, getRandomTime())
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown = e => {
    if (e.key === ' ') {
      this.spacePressed()
    }
  }

  spacePressed = () => {
    if (this._timeout !== null) {
      clearTimeout(this._timeout)
      this._timeout = null
    }

    if (this.state.currentState === 'appear') {
      this.setState({
        currentState: 'correct',
      })

      const newActionEntry = ActionManager.getActionEntry('answer', {
        index: this.state.index,
      })
      this.props.appendAction(newActionEntry)

      setTimeout(this.advance, 1000)
    } else if (this.state.currentState === 'waiting') {
      this.setState({
        currentState: 'wrong',
      })

      const newActionEntry = ActionManager.getActionEntry('action', {
        actionType: 'early_action',
        index: this.state.index,
      })
      this.props.appendAction(newActionEntry)

      setTimeout(this.reset, 1000)
    }
  }

  appear = () => {
    if (this.state.currentState === 'waiting') {
      this.setState({
        currentState: 'appear',
      })
      ActionManager.reset()
    }
  }

  getRounds = () => {
    const isPractice = this.props.taskVars.isPractice
    return isPractice ? NUM_ROUNDS_PRACTICE : NUM_ROUNDS
  }

  advance = () => {
    const nextIndex = this.state.index + 1

    if (nextIndex >= this.getRounds()) {
      this.setState({
        currentState: 'leaving',
      })
      setTimeout(() => {
        this.props.switchState('levelup')
      }, 1000)
    } else {
      this.setState({
        index: this.state.index + 1,
        currentState: 'waiting',
      })
      this._timeout = setTimeout(this.appear, getRandomTime())
    }
  }

  reset = () => {
    this.setState({
      currentState: 'waiting',
    })
    this._timeout = setTimeout(this.appear, getRandomTime())
  }

  render() {
    return (
      <div className={cs.coreTaskState}>
        <div className={cs.title}>Round {this.state.index + 1} of {this.getRounds()}</div>
        <TransitionGroup className={cs.symbolsAnimationGroup}>
          {(this.state.currentState === 'appear' || this.state.currentState === 'correct') &&
            <CSSTransition
              key='symbols'
              timeout={{
                enter: 50,
                exit: 200
              }}
              classNames={getAnimationClassNames('symbolsAnimation', cs)}
            >
              <div>
                {this.state.currentState === 'appear' &&
                  <div className={cs.symbol}>
                    <Icon glyph='circle-alert' />
                  </div>
                }
                {this.state.currentState === 'correct' &&
                  <div className={cs.symbol}>
                    <Icon glyph='circle-check' />
                  </div>
                }
              </div>
            </CSSTransition>
          }
        </TransitionGroup>
        <div className={cs.instruction}>
          Press spacebar when you see the symbol.
        </div>
      </div>
    )
  }
}

CoreTaskState.propTypes = {
  switchState: PropTypes.func.isRequired,
  appendAction: PropTypes.func.isRequired,
  currentStage: PropTypes.stage,
  taskVars: PropTypes.taskVars,
}
