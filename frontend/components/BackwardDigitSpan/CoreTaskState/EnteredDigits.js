import cx from 'classnames'

import PropTypes from '~/utils/propTypes'

import cs from './styles.css'

const EnteredDigits = props =>
  <div className={cx(props.className, cs.enteredDigits)}>
    {props.digits.map((i, index) =>
      <div className={cx(cs.enteredDigit, index === props.boldIndex && cs.bold)} key={index}>
        {i}
      </div>
    )}
  </div>

EnteredDigits.propTypes = {
  digits: PropTypes.arrayOf(PropTypes.number),
  boldIndex: PropTypes.number,
  className: PropTypes.string,
}

export default EnteredDigits
