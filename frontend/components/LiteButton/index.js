import cx from 'classnames'

import cs from './styles.css'
import PropTypes from '~/utils/propTypes'

const LiteButton = props =>
  <div
    className={cx(cs.liteButton, props.className, props.disabled && cs.disabled)}
    onClick={!props.disabled && props.onClick}
  >
    {props.children}
  </div>

LiteButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default LiteButton
