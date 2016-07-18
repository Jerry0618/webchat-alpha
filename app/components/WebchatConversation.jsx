import React, { Component } from 'react'
import PropTypes from '../lib/PropTypes'
import Button from './Button'
import Input from './Input'
import MessageList from './MessageList'

export default class WebchatConversation extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleMessageChange: PropTypes.func.isRequired,
    handleMessageSubmit: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired
  }

  render () {
    return <div>
      <MessageList
        messages={this.props.messages}
      />

      <Input
        onChange={this.props.handleMessageChange}
        onKeyUp={this.props.handleMessageSubmit}
        type="text"
        value={this.props.currentMessage}
      />

      <Button onClick={this.props.handleBack}>Back to first screen (debug, remove later)</Button>
    </div>
  }
}
