import { Component } from 'react'

import { TaskEngine, TitleState } from '~/components'

import cs from './styles.css'

const taskStates = {
  title: TitleState,
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
