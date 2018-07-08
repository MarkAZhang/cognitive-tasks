import cx from 'classnames'
import { Component } from 'react'
import { range, reverse } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import ActionManager from '~/utils/actionManager'

import cs from './styles.css'

export default class InstructionState extends Component {
  componentWillMount() {
    ActionManager.reset()
    if (this.props.shouldStartNewSession()) {
      this.props.startNewSession('reaction')
    }
    this.props.startNewStage({
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
        <div className={cs.levelDisplay}>Instructions</div>
        <div className={cs.instructions}>
          <div className={cs.instruction}>
            <span>During the test, the following picture will appear after a short delay.</span>
          </div>
          <div className={cs.alertIcon}>
            <Icon glyph='circle-alert' />
          </div>
          <div className={cs.instruction}>
            When you see this picture, press the spacebar as fast as you can.
          </div>
          <div className={cs.instruction}>
            Do not press the spacebar before the picture appears.
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
