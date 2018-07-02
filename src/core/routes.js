import {Route} from 'react-router'
import {BrowserRouter, Switch} from 'react-router-dom'

import {BackwardDigitSpan, NBack} from '../pages'

export default (
  <BrowserRouter>
    <Switch>
      <Route path='/digits' component={BackwardDigitSpan} />
      <Route path='/nback' component={NBack} />
    </Switch>
  </BrowserRouter>
)
