import { Component } from 'react'
import { isFinite, toNumber } from 'lodash/fp'

import PropTypes from '~/utils/propTypes'

import { LiteButton } from '~/components'

import cs from './styles.css'

export default class SignInState extends Component {
  state = {
    testId: '',
    age: '',
    gender: '',
    stage: 0,
    ageError: false,
  }

  isContinueDisabled = () => {
    const { stage, testId, age, gender } = this.state
    return stage === 2 &&
      (testId === '' ||
      !isFinite(toNumber(age, 10)) ||
      gender === '')
  }

  checkAge = () => {
    this.setState({
      ageError: !isFinite(toNumber(this.state.age)),
    })
  }

  onContinue = () => {
    if (this.state.stage === 2) {
      const { testId, age, gender } = this.state
      this.props.updateUserMetadata({
        testId,
        age,
        gender,
      })

      this.props.switchState('instruction')
    }

    if (this.state.stage < 2) {
      this.setState({
        stage: this.state.stage + 1,
      })
    }
  }

  onIDChange = event => {
    this.setState({
      testId: event.target.value,
    })
  }

  onAgeChange = event => {
    this.setState({
      age: event.target.value,
    })
  }

  onGenderChange = event => {
    this.setState({
      gender: event.target.value,
    })
  }

  render() {
    const isReactionTime = window.location.pathname.indexOf('reaction') !== -1
    return (
      <div className={cs.signInState}>
        {this.state.stage === 0 && <div className={cs.title}>Welcome</div>}
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
            {!isReactionTime &&
              <div className={cs.stageOne}>
                <div className={cs.instruction}>
                  As you progress, the task will get more difficult.
                </div>
                <div className={cs.instruction}>
                  After each stage, we will give you feedback on your performance.
                </div>
              </div>
            }
            {isReactionTime &&
              <div className={cs.reactionTimeInstructions}>
                <div className={cs.instruction}>
                  After the test, we will give you feedback on your performance.
                </div>
              </div>
            }
          </div>
        }
        {this.state.stage === 2 &&
          <div>
            <div className={cs.instruction}>
              To begin, please complete the following:
            </div>
            <div className={cs.field}>
              <div className={cs.label}>Test ID</div>
              <div className={cs.inputContainer}>
                <input className={cs.input} type='text' onChange={this.onIDChange} value={this.state.testId} />
              </div>
            </div>
            <div className={cs.field}>
              <div className={cs.label}>Age</div>
              <div className={cs.inputContainer}>
                <input
                  className={cs.input}
                  type='text'
                  onChange={this.onAgeChange}
                  onFocus={() => this.setState({ageError: false})}
                  onBlur={this.checkAge}
                  value={this.state.age}
                />
              </div>
            </div>
            {this.state.ageError &&
              <div className={cs.error}>
                Please input a number for your age.
              </div>
            }
            <div className={cs.field}>
              <div className={cs.label}>Gender</div>
              <div className={cs.inputContainer}>
                <select className={cs.select} onChange={this.onGenderChange} value={this.state.gender}>
                  <option value=''></option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                  <option value='Decline'>Decline to Answer</option>
                </select>
              </div>
            </div>
          </div>
        }
        <div className={cs.bottomButtonContainer}>
          <LiteButton disabled={this.isContinueDisabled()} onClick={this.onContinue}>Continue</LiteButton>
        </div>
      </div>
    )
  }
}

SignInState.propTypes = {
  switchState: PropTypes.func.isRequired,
  updateUserMetadata: PropTypes.func.isRequired,
  taskData: PropTypes.taskData,
}
