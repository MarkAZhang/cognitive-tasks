import PropTypes from 'prop-types'

import { Icon } from '~/components'

import cs from './styles.css'

const TitleState = props => (
  <div className={cs.titleState}>
    <div className={cs.header}>
      <div className={cs.title}>N-Back</div>
      <div className={cs.subtitle}>Cognitive Test</div>
    </div>
    <div className={cs.icons}>
      <Icon glyph='circle' />
      <Icon glyph='star' />
      <Icon glyph='triangle' />
      <Icon glyph='square' />
    </div>
    <div className={cs.startContainer}>
      <div
        className={cs.startButton}
        onClick={() => props.switchState('instruction')}
      >
        Start
      </div>
    </div>
  </div>
)

TitleState.propTypes = {
  switchState: PropTypes.func.isRequired,
}

export default TitleState
