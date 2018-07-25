import { Component } from 'react'

import { TaskEngine } from '~/components'
import {
  TitleState, InstructionState, CoreTaskState, LevelUpState
} from '~/components/BackwardDigitSpan'

// Reuse some components from NBack.
import {
  SignInState,
} from '~/components/NBack'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  signin: SignInState,
  instruction: InstructionState,
  core: CoreTaskState,
  levelup: LevelUpState,
}

class BackwardDigitSpan extends Component {
  render() {
    return (
      <div className={cs.center}>
        <TaskEngine
          taskStates={taskStates}
          startState='title'
          initialTaskVars={{
            n: 2,
            isPractice: false,
          }}
        />
      </div>
    )
  }
}

export default BackwardDigitSpan
