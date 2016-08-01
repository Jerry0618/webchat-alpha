import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'

export default class UserIsTyping extends Component {
  static propTypes = {
    user: PropTypes.string.isRequired
  }

  state = {
    dots: ''
  }

  updateDots () {
    setTimeout(() => {
      if (!this._stopDots) {
        const dots = (this.state.dots.length >= 3) ? '' : this.state.dots + '.'
        this.setState({ dots })
        this.updateDots()
      }
    }, 300)
  }

  componentDidMount () {
    this.updateDots()
  }

  componentWillUnmount () {
    this._stopDots = true
  }

  render () {
    return <p className="govuk-gray-1 f5">
      {this.props.user} is typing{this.state.dots}
    </p>
  }
}
