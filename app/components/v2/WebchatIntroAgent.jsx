import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'
import Button from './Button'
import Input from './Input'
import Label from './Label'

export default class WebchatIntroAgent extends Component {
  static propTypes = {
    handleNameChange: PropTypes.func.isRequired,
    handleWelcomeMessageChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    welcomeMessage: PropTypes.string.isRequired
  }

  render () {
    return <div>
      <p>Please fill in your name to start chatting.</p>

      <div className="w-75 mt3">
        <Label htmlFor="webchat-input-name">Name</Label>
        <Input
          handleChange={this.props.handleNameChange}
          id="webchat-input-name"
          type="text"
          value={this.props.name}
        />
      </div>

      <div className="mt3">
        <Label htmlFor="webchat-input-welcome-message">Welcome message</Label>
        <Input
          handleChange={this.props.handleWelcomeMessageChange}
          id="webchat-input-welcome-message"
          type="text"
          value={this.props.welcomeMessage}
        />
      </div>

      <div className="w-50 mt3">
        <Button onClick={this.props.handleSubmit}>Start the chat</Button>
      </div>
    </div>
  }
}
