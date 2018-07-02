import PropTypes from 'prop-types'
import { Component } from 'react'

import { Icon } from '~/components'

import cs from './styles.css'

export default class TitleState extends Component {
  componentWillMount() {
    // Reset data
    this.props.updateTaskData({
      n: 1,
      userAnswers: []
    })
  }

  render() {
    return (
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