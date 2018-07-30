import { Component } from 'react'
import { map, max, filter, flow, flatten, sum } from 'lodash/fp'
import { round } from 'lodash'

import { BasicDataTable, LiteButton } from '~/components'
import { getReactionSessions } from '~/utils/endpoints'
import { exportCsvFile } from '~/utils/csv'

import cs from './styles.css'

const COLUMNS = [
  {
    header: 'MTurk Worker ID',
    key: 'mturkId',
  },
  {
    header: 'Age',
    key: 'age',
  },
  {
    header: 'Gender',
    key: 'gender',
  },
  {
    header: 'Avg. Reaction Time (ms)',
    key: 'averageAnswerSpeed',
  },
  {
    header: 'Early Actions',
    key: 'numEarlyActions',
  },
  {
    header: 'Practice Sessions',
    key: 'practiceSessions',
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
    header: 'IP',
    key: 'ip',
  },
  {
    header: 'User Agent',
    key: 'userAgent',
  },
  {
    header: 'Full Log of User Actions',
    key: 'stages',
    width: 600
  },
]

const processTestSession = session => {
  const highestN = max(map(stage => stage.metadata.n, session.stages))
  const practiceSessions = filter(stage => stage.metadata.isPractice, session.stages).length
  const allOfficialAnswers = flow(
    filter(stage => !stage.metadata.isPractice),
    map('actions'),
    flatten,
    filter(action => action.type === 'answer'),
    map('ms'),
  )(session.stages)

  const allEarlyActions = flow(
    filter(stage => !stage.metadata.isPractice),
    map('actions'),
    flatten,
    filter(action => action.type === 'action' && action.metadata.actionType === 'early_action')
  )(session.stages)

  const data = {
    ...session,
    highestN,
    practiceSessions,
    averageAnswerSpeed: round(sum(allOfficialAnswers) / allOfficialAnswers.length),
    numEarlyActions: allEarlyActions.length,
  }

  return data
}

class ReactionSessionTable extends Component {
  state = {
    testSessionData: null,
  }

  componentWillMount = async () => {
    const allTestSessions = await getReactionSessions()

    this.setState({
      testSessionData: map(processTestSession, allTestSessions),
    })
  }

  downloadCSV = () => {
    exportCsvFile(
      'reaction_test_sessions.csv',
      this.state.testSessionData,
      COLUMNS,
    )
  }

  render() {
    return (
      <div>
        {this.state.testSessionData &&
          <div className={cs.info}>
            <div className={cs.label}>Displaying {this.state.testSessionData.length} sessions</div>
            <LiteButton className={cs.csvButton} onClick={this.downloadCSV}>Download CSV</LiteButton>
          </div>
        }
        <BasicDataTable data={this.state.testSessionData} columns={COLUMNS} className={cs.testSessionTable} tall />
      </div>
    )
  }
}

export default ReactionSessionTable
