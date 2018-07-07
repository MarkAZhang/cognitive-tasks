import { Component } from 'react'
import cx from 'classnames'

import { Icon, LiteButton } from '~/components'
import PropTypes from '~/utils/propTypes'

import EnteredDigits from '../CoreTaskState/EnteredDigits'

import cs from './styles.css'

export default class TitleState extends Component {
  onContinue = () => {
    if (this.props.userMetadata.awsId === null) {
      this.props.switchState('signin')
    } else {
      this.props.switchState('instruction')
    }
  }

  render() {
    return (
      <div className={cs.titleState}>
        <div className={cs.header}>
          <div className={cs.title}>Backward Digit Span</div>
          <div className={cs.subtitle}>Cognitive Test</div>
        </div>
        <div className={cs.digits}>
          <EnteredDigits className={cs.blanks} digits={[6, 5, 4, null, null, null]} boldIndex={3} />
        </div>
        <div className={cs.startContainer}>
          <LiteButton
            className={cs.startButton}
            onClick={this.onContinue}
          >
            Start
          </LiteButton>
        </div>
      </div>
    )
  }
}

TitleState.propTypes = {
  switchState: PropTypes.func.isRequired,
  userMetadata: PropTypes.userMetadata,
}
