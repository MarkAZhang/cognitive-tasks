import { Component } from 'react'
import { map, max, filter, flow, flatten, sum } from 'lodash/fp'
import { round } from 'lodash'

import { BasicDataTable, LiteButton } from '~/components'
import { getDigitsSessions } from '~/utils/endpoints'
import { exportCsvFile } from '~/utils/csv'

import cs from './styles.css'

const COLUMNS = [
  {
    header: 'Test ID',
    key: 'testId',
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
    header: 'Highest N Reached',
    key: 'highestN',
  },
  {
    header: 'Practice Sessions',
    key: 'practiceSessions',
  },
  {
    header: 'Avg. Answer Speed (s)',
    key: 'averageAnswerSpeed',
  },
  { header: 'Practice Sessions for Highest N', key: 'practiceSessions_highestN' },
  { header: 'Avg. Answer Speed for Highest N (s)', key: 'averageAnswerSpeed_highestN' },
  {
    header: 'Start Time',
    key: 'startTime',
  },
  {
    header: 'End Time',
    key: 'endTime',
  },
  { header: 'Practice Sessions for N=2', key: 'practiceSessions_2' },
  { header: 'Avg. Answer Speed for N=2 (s)', key: 'averageAnswerSpeed_2' },
  { header: 'Practice Sessions for N=3', key: 'practiceSessions_3' },
  { header: 'Avg. Answer Speed for N=3 (s)', key: 'averageAnswerSpeed_3' },
  { header: 'Practice Sessions for N=4', key: 'practiceSessions_4' },
  { header: 'Avg. Answer Speed for N=4 (s)', key: 'averageAnswerSpeed_4' },
  { header: 'Practice Sessions for N=5', key: 'practiceSessions_5' },
  { header: 'Avg. Answer Speed for N=5 (s)', key: 'averageAnswerSpeed_5' },
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

const getAnswersForN = (n, session) =>
  flow(
    filter(stage => !stage.metadata.isPractice && stage.metadata.n === n),
    map('actions'),
    flatten,
    filter(action => action.type === 'answer'),
    map('ms'),
  )(session.stages)

const getPracticeSessionsForN = (n, session) =>
  filter(
    stage => stage.metadata.isPractice && stage.metadata.n === n,
  )(session.stages).length

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

  const data = {
    ...session,
    highestN,
    practiceSessions,
    averageAnswerSpeed: round(sum(allOfficialAnswers) / allOfficialAnswers.length / 1000, 2),
  }

  for (let i = 2; i <= 5; i++) {
    if (i > highestN) {
      data[`averageAnswerSpeed_${i}`] = '--'
      data[`practiceSessions_${i}`] = '--'
    } else {
      const answersForN = getAnswersForN(i, session)
      const practiceSessionsForN = getPracticeSessionsForN(i, session)

      data[`averageAnswerSpeed_${i}`] = round(sum(answersForN) / answersForN.length / 1000, 2)
      data[`practiceSessions_${i}`] = practiceSessionsForN
    }
  }

  const answersForN = getAnswersForN(highestN, session)
  const practiceSessionsForN = getPracticeSessionsForN(highestN, session)

  data.averageAnswerSpeed_highestN = round(sum(answersForN) / answersForN.length / 1000, 2)
  data.practiceSessions_highestN = practiceSessionsForN

  return data
}

class DigitsSessionTable extends Component {
  state = {
    testSessionData: null,
  }

  componentWillMount = async () => {
    const allTestSessions = await getDigitsSessions()

    this.setState({
      testSessionData: map(processTestSession, allTestSessions),
    })
  }

  downloadCSV = () => {
    exportCsvFile(
      'digits_test_sessions.csv',
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

export default DigitsSessionTable
