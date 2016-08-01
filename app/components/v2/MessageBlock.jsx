import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'
import MessageTime from './MessageTime'

export default class MessageBlock extends Component {
  static propTypes = {
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired
  }

  render () {
    return <div>
      <div className="flex justify-between govuk-gray-1 f5">
        <span>{this.props.author}</span>
        <MessageTime time={this.props.time} />
      </div>
      <p className="mt0">{this.props.content}</p>
    </div>
  }
}
