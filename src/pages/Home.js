import { Component } from 'react'

import { TaskEngine, TitleState, InstructionState } from '~/components'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  instruction: InstructionState,
}

class Home extends Component {
  render() {
    return (
      <div className={cs.center}>
        <TaskEngine
          taskStates={taskStates}
          startState='title'
        />
      </div>
    )
  }
}

export default Home
