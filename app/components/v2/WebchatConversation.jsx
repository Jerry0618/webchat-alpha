import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from '../../lib/PropTypes'
import Button from './Button'
import Input from './Input'
import MessageList from './MessageList'

export default class WebchatConversation extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    handleMessageChange: PropTypes.func.isRequired,
    handleMessageSubmit: PropTypes.func.isRequired,
    messages: PropTypes.messages.isRequired,
    name: PropTypes.string.isRequired,
    userIsTyping: PropTypes.string.isRequired
  }

  componentDidMount () {
    const isDesktop = window.innerWidth > 700
    if (isDesktop) {
      ReactDOM.findDOMNode(this.refs.messageInput).focus()
    }
  }

  render () {
    return <div className="h-100">
      <div style={{ height: 'calc(100% - 3rem)' }}>
        <MessageList
          messages={this.props.messages}
          userIsTyping={this.props.userIsTyping}
          name={this.props.name}
        />
      </div>

      <div className="flex">
        <div className="w-75 pr1">
          <Input
            handleChange={this.props.handleMessageChange}
            handleSubmit={this.props.handleMessageSubmit}
            ref="messageInput"
            type="text"
            value={this.props.currentMessage}
          />
        </div>
        <div className="w-25">
          <Button onClick={this.props.handleMessageSubmit}>Reply</Button>
        </div>
      </div>
    </div>
  }
}
