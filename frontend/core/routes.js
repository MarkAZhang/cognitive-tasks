import {Route} from 'react-router'
import {BrowserRouter, Switch} from 'react-router-dom'

import {BackwardDigitSpan, NBack, UserTable, TestSessionTable, ReactionTime} from '../pages'

export default (
  <BrowserRouter>
    <Switch>
      <Route path='/digits' component={BackwardDigitSpan} />
      <Route path='/nback' component={NBack} />
      <Route path='/reaction' component={ReactionTime} />
      <Route path='/data-users' component={UserTable} />
      <Route path='/data-tests' component={TestSessionTable} />
    </Switch>
  </BrowserRouter>
)
