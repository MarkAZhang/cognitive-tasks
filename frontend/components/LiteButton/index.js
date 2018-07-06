import cx from 'classnames'

import cs from './styles.css'
import PropTypes from '~/utils/propTypes'

const LiteButton = props =>
  <div className={cx(cs.liteButton, props.className)} onClick={props.onClick}>{props.children}</div>

LiteButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default LiteButton
