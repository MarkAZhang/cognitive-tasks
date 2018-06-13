import {BrowserRouter} from 'react-router-dom'

import routes from './routes'

const App = () => (
  <div>
    <BrowserRouter>
      {routes}
    </BrowserRouter>
  </div>
)

export default App
