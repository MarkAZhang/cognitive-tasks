import PropTypes from '~/utils/propTypes'
import { Icon } from '~/components'

import cs from './styles.css'

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

export default ExampleBlock
