import { Component } from 'react'

import { TaskEngine } from '~/components'
import {
  TitleState, InstructionState, CoreTaskState, EndState, LevelUpState
} from '~/components/BackwardDigitSpan'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  instruction: InstructionState,
  coretask: CoreTaskState,
  end: EndState,
  levelup: LevelUpState,
}

class BackwardDigitSpan extends Component {
  render() {
    return (
      <div className={cs.center}>
        <TaskEngine
          taskStates={taskStates}
          startState='title'
          startTaskData={{
            n: 11,
            userAnswers: [],
          }}
        />
      </div>
    )
  }
}

export default BackwardDigitSpan
