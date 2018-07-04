import { Component } from 'react'

import PropTypes from '~/utils/propTypes'
import { userSignIn } from '~/utils/endpoints'

import { LiteButton } from '~/components'

import cs from './styles.css'

export default class SignInState extends Component {
  state = {
    awsId: '',
    stage: 0,
  }

  onContinue = () => {
    if (this.state.stage == 0) {
      this.setState({
        stage: 1,
      })
    } else {
      const userMetadata = {
        awsId: this.state.awsId,
      }
      this.props.updateTaskData({
        userMetadata,
      })
      userSignIn(userMetadata).then(data => {
        this.props.updateTaskData({
          userMetadata: {
            serverId: data.userId,
            awsId: this.state.awsId,
          },
        })
      })
      this.props.switchState('instruction')
    }
  }

  onChange = event => {
    this.setState({
      awsId: event.target.value,
    })
  }

  render() {
    return (
      <div className={cs.signInState}>
        <div className={cs.title}>Welcome</div>
        {this.state.stage === 0 &&
          <div>
            <div className={cs.instruction}>
              The following task will help us gauge your cognitive abilities for research purposes.
            </div>
            <div className={cs.instruction}>
              Data about your performance will be anonymized and sent to a central server.
            </div>
          </div>
        }
        {this.state.stage === 1 &&
          <div>
            <div className={cs.instruction}>
              As you progress, the task will get more difficult.
            </div>
            <div className={cs.instruction}>
              After each stage, we will give you feedback on your performance.
            </div>
            <div className={cs.instruction}>
              To begin, please enter your AWS ID.
            </div>
            <div className={cs.inputContainer}>
              <input className={cs.input} type='text' onChange={this.onChange} value={this.state.awsId} />
            </div>
          </div>
        }
        <div className={cs.buttonContainer}>
          <LiteButton onClick={this.onContinue}>Continue</LiteButton>
        </div>
      </div>
    )
  }
}

SignInState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateTaskData: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
