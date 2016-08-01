import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'
import Button from './Button'
import Input from './Input'
import Label from './Label'

export default class WebchatIntroClient extends Component {
  static propTypes = {
    handleNameChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
  }

  render () {
    return <div>
      <p>Please fill in your name to start chatting.</p>

      <div className="w-75">
        <Label htmlFor="webchat-input-name">Name</Label>
        <Input
          id="webchat-input-name"
          handleChange={this.props.handleNameChange}
          handleSubmit={this.props.handleSubmit}
          type="text"
          value={this.props.name}
        />
      </div>

      <div className="w-50 mt3">
        <Button onClick={this.props.handleSubmit}>Start the chat</Button>
      </div>
    </div>
  }
}
