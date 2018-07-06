import cx from 'classnames'
import { Component } from 'react'
import { concat } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'
import { Icon, LiteButton } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'
import ActionManager from '~/utils/actionManager'

import ExampleBlock from './ExampleBlock'
import cs from './styles.css'

const EXAMPLE_NUMBER = 8

export default class InstructionState extends Component {
  state = {
    exampleShapes: generateShapes(this.props.taskData.n, EXAMPLE_NUMBER, true),
  }

  componentWillMount() {
    ActionManager.reset()
    // Session starts on Stage 1 instructions.
    if (this.props.taskData.n === 1) {
      this.props.updateTaskData({
        // session starts on title screen
        currentSession: {
          type: 'nback',
          startTime: new Date(),
          endTime: null,
          actions: [],
        }
      })
    }
  }

  onPractice = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'instructions_practice',
      n: this.props.taskData.n,
    })

    this.props.setTaskData('currentSession.actions',
      concat(this.props.taskData.currentSession.actions, newActionEntry),
    )

    this.props.updateTaskData({
      isPractice: true,
    })

    this.props.switchState('nback')
  }

  onStart = () => {
    const newActionEntry = ActionManager.getActionEntry('action', {
      actionType: 'instructions_start_test',
      n: this.props.taskData.n,
    })

    this.props.setTaskData('currentSession.actions',
      concat(this.props.taskData.currentSession.actions, newActionEntry),
    )

    this.props.switchState('nback')
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Stage {this.props.taskData.n}</div>
        <div className={cs.instructions}>
          <div className={cs.instruction}>
            You will be shown a series of shapes.
          </div>
          <div className={cs.instruction}>
            {this.props.taskData.n === 1
              ? <span>If the current shape is the same as <b>the last shape</b>,</span>
              : <span>If the current shape is the same as the shape <b>{this.props.taskData.n} steps ago</b>,</span>
            }
            &nbsp;press <Icon className={cx(cs.inlineIcon, cs.yesIcon)} glyph='yes' />.
          </div>
          <div className={cs.instruction}>
            Otherwise, press <Icon className={cx(cs.inlineIcon, cs.noIcon)} glyph='no' />.
          </div>
        </div>
        {this.props.taskData.n <= EXAMPLE_NUMBER &&
          <div className={cs.title}>Example</div>
        }
        {this.props.taskData.n <= EXAMPLE_NUMBER &&
          <div className={cs.example}>
            {_.range(0, this.state.exampleShapes.length).map(index =>
              <ExampleBlock
                index={index}
                shapes={this.state.exampleShapes}
                n={this.props.taskData.n}
                key={index}
              />
            )}
          </div>
        }
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
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
