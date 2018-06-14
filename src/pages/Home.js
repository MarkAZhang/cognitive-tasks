import { Component } from 'react'

import {
  TaskEngine, TitleState, InstructionState, NBackState, EndState, LevelUpState
} from '~/components'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  instruction: InstructionState,
  nback: NBackState,
  end: EndState,
  levelup: LevelUpState,
}

class Home extends Component {
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

export default Home
