import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'

export default class Label extends Component {
  static propTypes = {
    htmlFor: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  render () {
    return <label
      className="db"
      htmlFor={this.props.htmlFor}
      style={{ paddingBottom: '2px' }}
    >
      {this.props.children}
    </label>
  }
}
