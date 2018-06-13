import PropTypes from 'prop-types'

import cs from './styles.css'
import cx from 'classnames'

const Icon = props =>
  <i className={cx(props.className, cs[`icon-${props.glyph}`])} />

Icon.propTypes = {
  glyph: PropTypes.string,
  className: PropTypes.string,
}

export default Icon
