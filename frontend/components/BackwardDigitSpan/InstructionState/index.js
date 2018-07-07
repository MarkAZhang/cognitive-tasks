import cx from 'classnames'
import { Component } from 'react'
import { range, reverse } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import ActionManager from '~/utils/actionManager'

import cs from './styles.css'
import EnteredDigits from '../CoreTaskState/EnteredDigits';

const EXAMPLE_LIMIT = 6

export default class InstructionState extends Component {
  state = {
    exampleDigits: range(1, this.props.taskVars.n + 1),
  }

  componentWillMount() {
    ActionManager.reset()
    // Session starts on Stage 1 instructions.
    if (this.props.shouldStartNewSession()) {
      this.props.startNewSession('digits')
    }
    this.props.startNewStage({
      n: this.props.taskVars.n,
      isPractice: false,
    })
  }

  onPractice = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'instructions_practice',
    })

    this.props.appendAction(newActionEntry)
    this.props.updateCurrentStageMetadata({
      isPractice: true,
    })
    this.props.updateTaskVars({
      isPractice: true,
    })

    this.props.switchState('core')
  }

  onStart = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'instructions_start_test',
    })

    this.props.appendAction(newActionEntry)

    this.props.switchState('core')
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Stage {this.props.taskVars.n - 1}</div>
        <div className={cs.instructions}>
          <div className={cs.instruction}>
            <span>You will be shown {this.props.taskVars.n} random digits, one after another</span>
          </div>
          {this.props.taskVars.n <= EXAMPLE_LIMIT &&
            <div className={cs.example}>
              <div className={cs.digits}>
                {this.state.exampleDigits.map((digit, index) =>
                  <div className={cs.exampleDigit} key={index}>
                    {digit}
                  </div>
                )}
              </div>
            </div>
          }
          <div className={cs.instruction}>
            Enter these digits <b>backwards</b> on the following screen.
          </div>
          {this.props.taskVars.n <= EXAMPLE_LIMIT &&
            <div className={cs.example}>
              <EnteredDigits className={cs.enteredDigits} digits={reverse(this.state.exampleDigits)} />
              <div className={cs.checks}>
                {this.state.exampleDigits.map((_, index) =>
                  <Icon key={index} glyph='yes' className={cs.yesIcon} />
                )}
              </div>
            </div>
          }
        </div>
        <div className={cs.controls}>
          <LiteButton className={cs.button} onClick={this.onPractice}>Practice</LiteButton>
          <LiteButton className={cs.button} onClick={this.onStart}>Start Test</LiteButton>
        </div>
      </div>
    )
  }
}

InstructionState.propTypes = {
  switchState: PropTypes.func.isRequired,
  shouldStartNewSession: PropTypes.func.isRequired,
  startNewSession: PropTypes.func.isRequired,
  startNewStage: PropTypes.func.isRequired,
  appendAction: PropTypes.func.isRequired,
  updateCurrentStageMetadata: PropTypes.func.isRequired,
  updateTaskVars: PropTypes.func.isRequired,
  taskVars: PropTypes.taskVars,
}
