import { Component } from 'react'

import { BasicDataTable, LiteButton } from '~/components'
import { getAllUsers } from '~/utils/endpoints'
import { exportCsvFile } from '~/utils/csv'

import cs from './styles.css'

const COLUMNS = [
  {
    header: 'Server ID',
    key: 'serverId',
  },
  {
    header: 'AWS ID',
    key: 'awsId',
  },
  {
    header: 'Number of Test Sessions',
    key: 'numSessions',
  },
]

class UserTable extends Component {
  state = {
    userData: null,
  }

  componentWillMount = async () => {
    const allUsers = await getAllUsers()
    this.setState({
      userData: allUsers,
    })
  }

  downloadCSV = () => {
    exportCsvFile(
      'nback_users.csv',
      this.state.userData,
      COLUMNS,
    )
  }

  render() {
    return (
      <div>
        {this.state.userData &&
          <div className={cs.info}>
            <div className={cs.label}>Displaying {this.state.userData.length} users</div>
            <LiteButton className={cs.csvButton} onClick={this.downloadCSV}>Download CSV</LiteButton>
          </div>
        }
        <BasicDataTable data={this.state.userData} columns={COLUMNS} className={cs.userTable} />
      </div>
    )
  }
}

export default UserTable
