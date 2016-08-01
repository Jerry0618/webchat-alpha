import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'

export default class Button extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

  render () {
    return <button
      className="w-100 db ph3 pb1 pt2 bg-govuk-green-1 bn white pointer hover-bg-govuk-green-3 shadow-green outline relative active-offset"
      onClick={this.props.onClick}
    >
      {this.props.children}
    </button>
  }
}
