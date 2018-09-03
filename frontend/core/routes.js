import {Route} from 'react-router'
import {BrowserRouter, Switch} from 'react-router-dom'

import {
  BackwardDigitSpan, NBack, ReactionTime,
  UserTable, NBackSessionTable, DigitsSessionTable, ReactionSessionTable,
  TestId, Redirect,
} from '../pages'

export default (
  <BrowserRouter>
    <Switch>
      <Route path='/get-test-id' component={TestId} />
      <Route path='/digits' component={BackwardDigitSpan} />
      <Route path='/nback' component={NBack} />
      <Route path='/reaction' component={ReactionTime} />
      <Route path='/data-users' component={UserTable} />
      <Route path='/data-nback' component={NBackSessionTable} />
      <Route path='/data-digits' component={DigitsSessionTable} />
      <Route path='/data-reaction' component={ReactionSessionTable} />
      <Route path='/survey' component={Redirect} />
    </Switch>
  </BrowserRouter>
)
