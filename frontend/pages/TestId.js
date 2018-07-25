import { Component } from 'react'

import { getTestID } from '~/utils/endpoints'

import cs from './styles.css'

export default class TestId extends Component {
  state = {
    testID: null,
  }

  async componentWillMount() {
    const testID = await getTestID()

    this.setState({
      testID,
    })
  }

  render() {
    if (!this.state.testID) {
      return <div className={cs.testId} />
    }

    return (
      <div className={cs.testId}>
        <div className={cs.content}>
          <div className={cs.text}>Your Test ID is</div>
          <div className={cs.id}>{this.state.testID}</div>
          <div className={cs.instructions}>Please copy and paste your Test ID into the survey, as well as each cognitive test</div>
          <div className={cs.heading}>Why use a random ID?</div>
          <div className={cs.answer}>By using a random ID, we are able to link the survey and cognitive test results while preserving your anonymity.</div>
        </div>
      </div>
    )
  }
}
