import PropTypes from 'prop-types'
import cx from 'classnames'
import { Component } from 'react'

import { Icon } from '~/components'
import { generateShapes } from '~/utils/shapes'

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
    exampleShapes: generateShapes(1, EXAMPLE_NUMBER, true),
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.title}>Instructions</div>
        <div className={cs.instructions}>
          <div className={cs.instruction}>
            If the current shape is the same as the last shape,
            press <Icon className={cx(cs.inlineIcon, cs.yesIcon)} glyph='yes' />.
          </div>
          <div className={cs.instruction}>
            Otherwise, press <Icon className={cx(cs.inlineIcon, cs.noIcon)} glyph='no' />.
          </div>
        </div>
        <div className={cs.title}>Example</div>
        <div className={cs.example}>
          {_.range(0, this.state.exampleShapes.length).map(index =>
            <ExampleBlock
              index={index}
              shapes={this.state.exampleShapes}
              n={1}
              key={index}
            />
          )}
        </div>
        <div className={cs.startContainer}>
          <div className={cs.startButton}>Start</div>
        </div>
      </div>
    )
  }
}
