import { Component } from 'react'

class Redirect extends Component {
  componentWillMount() {
    if (fbq) {
      fbq('track', 'SurveyRedirect')
    }
    setTimeout(() => {
      window.location.replace('https://www.google.com')
    }, 1000)
  }

  render() {
    return null
  }
}

export default Redirect
