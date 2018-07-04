import { Component } from 'react'

import { TaskEngine } from '~/components'
import {
  TitleState, InstructionState, NBackState, EndState, LevelUpState, SignInState,
} from '~/components/NBack'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
  instruction: InstructionState,
  nback: NBackState,
  levelup: LevelUpState,
  signin: SignInState,
}

class NBack extends Component {
  render() {
    return (
      <div className={cs.center}>
        <TaskEngine
          taskStates={taskStates}
          startState='title'
          startTaskData={{
            n: 1,
            userMetadata: {
              awsId: null,
              serverId: null, /* AWS-assigned numeric ID */
            },
            currentSession: {},
          }}
        />
      </div>
    )
  }
}

export default NBack
