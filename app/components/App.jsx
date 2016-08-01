import React, { Component } from 'react'
import PropTypes from '../lib/PropTypes'
import WebchatV1 from './v1/Webchat'
import WebchatV2 from './v2/Webchat'

export default class App extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['client', 'agent']).isRequired,
    version: PropTypes.oneOf(['1', '2']).isRequired
  }

  render () {
    let Webchat = null
    switch (this.props.version) {
      case '1':
        Webchat = WebchatV1
        break
      case '2':
        Webchat = WebchatV2
        break
      default:
        Webchat = () => <div>Unrecognized Webchat version: {this.props.version}</div>
        break
    }

    return <div className="f4 h-100">
      <Webchat type={this.props.type} />
    </div>
  }
}
