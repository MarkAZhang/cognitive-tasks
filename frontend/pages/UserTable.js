import { Component } from 'react'

import { BasicDataTable } from '~/components'
import { getAllUsers } from '~/utils/endpoints'

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

  render() {
    return (
      <div>
        <div className={cs.csvMsg}>CSV Download coming soon...</div>
        <BasicDataTable data={this.state.userData} columns={COLUMNS} className={cs.userTable} />
      </div>
    )
  }
}

export default UserTable
