import PropTypes from 'prop-types'
import { Component } from 'react'
import cx from 'classnames'

import { Icon } from '~/components'

import cs from './styles.css'

export default class TitleState extends Component {
  componentWillMount() {
    // Reset data
    this.props.updateTaskData({
      n: 2,
      userAnswers: []
    })
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.header}>
          <div className={cs.title}>Backward Digit Span</div>
          <div className={cs.subtitle}>Cognitive Test</div>
        </div>
        <div className={cs.digits}>
          <div className={cs.row}>
            <div className={cs.digit}>9</div>
            <div className={cs.digit}>8</div>
            <div className={cs.digit}>7</div>
          </div>
          <div className={cs.rowTwo}>
            <div className={cs.digit}>6</div>
            <div className={cs.digit}>5</div>
            <div className={cs.digit}>4</div>
          </div>
          <div className={cs.rowThree}>
            <div className={cs.digit}>3</div>
            <div className={cs.digit}>2</div>
            <div className={cs.digit}>1</div>
          </div>
        </div>
        <div className={cs.startContainer}>
          <div
            className={cs.startButton}
            onClick={() => this.props.switchState('instruction')}
          >
            Start
          </div>
        </div>
      </div>
    )
  }
}

TitleState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskData: PropTypes.func.isRequired,
}
