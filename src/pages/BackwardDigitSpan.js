import { Component } from 'react'

import { TaskEngine } from '~/components'
import {
  TitleState, InstructionState, NBackState, EndState, LevelUpState
} from '~/components/BackwardDigitSpan'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  instruction: InstructionState,
  nback: NBackState,
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
            n: 1,
            userAnswers: [],
          }}
        />
      </div>
    )
  }
}

export default BackwardDigitSpan
