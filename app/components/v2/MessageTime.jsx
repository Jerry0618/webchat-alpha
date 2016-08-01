import React, { Component } from 'react'
import PropTypes from '../../lib/PropTypes'

function pad (n) { return n < 10 ? '0' + n : n }

function HHMMDateString (d) {
  const HH = pad(d.getHours())
  const MM = pad(d.getMinutes())
  return `${HH}:${MM}`
}

export default class MessageTime extends Component {
  static propTypes = {
    time: PropTypes.number.isRequired
  }

  render () {
    const dateAt = new Date(this.props.time)
    const timeAt = HHMMDateString(dateAt)
    const dateTime = dateAt.toISOString()
    return <time dateTime={dateTime}>{timeAt}</time>
  }
}
