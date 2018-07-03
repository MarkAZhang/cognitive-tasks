import cx from 'classnames'
import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'
import { generateShapes } from '~/utils/nback/shapes'

import cs from './styles.css'

const EXAMPLE_NUMBER = 8

const ExampleBlock = ({ shapes, index, n }) =>
  <div className={cs.exampleBlock}>
    <div className={cs.index}>{index + 1}</div>
    <Icon className={cs.shape} glyph={shapes[index]} />
    <div className={cs.answer}>
      {index >= n &&
        (shapes[index] === shapes[index - n]
          ? <Icon glyph='yes' className={cs.yesIcon} />
          : <Icon glyph='no' className={cs.noIcon} />
        )
      }
    </div>
  </div>

ExampleBlock.propTypes = {
  shapes: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number,
  n: PropTypes.number,
}

export default class InstructionState extends Component {
  state = {
    exampleShapes: generateShapes(this.props.taskData.n, EXAMPLE_NUMBER, true),
  }

  onStart = () => {
    this.props.switchState('coretask')
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n}</div>
        <div className={cs.instructions}>
          <div className={cs.instruction}>
            {this.props.taskData.n === 1
              ? <span>You will be shown 1 digit.</span>
              : <span>You will be shown {this.props.taskData.n} digits, one after another</span>
            }
          </div>
          <div className={cs.instruction}>
            {this.props.taskData.n === 1
              ? <span>Remember this digit and enter it on the following screen.</span>
              : <span>Remember these digits and <b>enter them backwards</b> on the following screen.</span>
            }
          </div>
        </div>
        <div className={cs.startContainer}>
          <div className={cs.startButton} onClick={this.onStart}>Start</div>
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
