import { Component } from 'react'

import { TaskEngine } from '~/components'
import {
  CoreTaskState,
  TitleState,
  InstructionState,
  LevelUpState,
} from '~/components/ReactionTime'

// Reuse some components from NBack.
import {
  SignInState,
} from '~/components/NBack'

import cs from './styles.css'

const taskStates = {
  core: CoreTaskState,
  title: TitleState,
  signin: SignInState,
  levelup: LevelUpState,
  instruction: InstructionState,
}

class ReactionTime extends Component {
  componentWillMount() {
    if (fbq) {
      fbq('track', 'ReactionTime')
    }
  }
  render() {
    return (
      <div className={cs.center}>
        <TaskEngine
          taskStates={taskStates}
          startState='title'
          initialTaskVars={{
            isPractice: false,
          }}
        />
      </div>
    )
  }
}

export default ReactionTime
