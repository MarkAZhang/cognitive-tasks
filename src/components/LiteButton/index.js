import cs from './styles.css'
import PropTypes from '~/utils/propTypes'

const LiteButton = props =>
  <div className={cs.liteButton} onClick={props.onClick}>{props.children}</div>

LiteButton.propTypes = {
  onClick: PropTypes.func,
}

export default LiteButton
