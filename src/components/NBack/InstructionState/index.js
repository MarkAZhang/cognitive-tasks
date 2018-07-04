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
    this.props.switchState('nback')
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.levelDisplay}>Level {this.props.taskData.n}</div>
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
