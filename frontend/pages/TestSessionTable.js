import { Component } from 'react'

import { BasicDataTable } from '~/components'
import { getAllTestSessions } from '~/utils/endpoints'

import cs from './styles.css'

const COLUMNS = [
  {
    header: 'Server ID',
    key: 'serverId',
  },
  {
    header: 'User AWS ID',
    key: 'userId',
  },
  {
    header: 'Start Time',
    key: 'startTime',
  },
  {
    header: 'End Time',
    key: 'endTime',
  },
  {
    header: 'Test Type',
    key: 'type',
  },
  {
    header: 'Is Practice',
    key: 'isPractice',
  },
  {
    header: 'Actions',
    key: 'actions',
    grow: 3,
  },
]

class TestSessionTable extends Component {
  state = {
    testSessionData: null,
  }

  componentWillMount = async () => {
    const allTestSessions = await getAllTestSessions()
    this.setState({
      testSessionData: allTestSessions,
    })
  }

  render() {
    return (
      <BasicDataTable data={this.state.testSessionData} columns={COLUMNS} className={cs.testSessionTable} tall />
    )
  }
}

export default TestSessionTable
