import cx from 'classnames'
import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import ActionManager from '~/utils/actionManager'

import cs from './styles.css'

export default class InstructionState extends Component {
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
            {this.props.taskVars.n === 1
              ? <span>You will be shown 1 digit.</span>
              : <span>You will be shown {this.props.taskVars.n} digits, one after another</span>
            }
          </div>
          <div className={cs.instruction}>
            {this.props.taskVars.n === 1
              ? <span>Remember this digit and enter it on the following screen.</span>
              : <span>Remember these digits and <b>enter them backwards</b> on the following screen.</span>
            }
          </div>
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
