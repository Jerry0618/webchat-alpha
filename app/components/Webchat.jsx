/* global io */
import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from '../lib/PropTypes'
import WebchatAreYouSure from './WebchatAreYouSure'
import WebchatEnd from './WebchatEnd'
import WebchatIntroAgent from './WebchatIntroAgent'
import WebchatIntroClient from './WebchatIntroClient'
import WebchatQueue from './WebchatQueue'
import WebchatConversation from './WebchatConversation'
import IconClear from './IconClear'
import IconExpandMore from './IconExpandMore'

const advisers = [
  { name: 'Chris', image: 'https://pbs.twimg.com/profile_images/103521656/cheathco_square.jpg' },
  { name: 'Emma', image: 'https://avatars.slack-edge.com/2016-07-11/58543921264_069b73b591245de5ef4d_192.png' },
  { name: 'Theo', image: 'https://pbs.twimg.com/profile_images/455332460046188544/19_XJF18.png' }
]

export default class Webchat extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['client', 'client-overlay', 'agent']).isRequired
  }

  state = {
    currentMessage: '',
    messages: [],
    myName: '',
    overlayVisible: false,
    overlayMinimized: false,
    queueSize: 10,
    selectedAdviser: 0,
    step: 'intro',
    userConnected: false,
    whoIsTyping: '',
    welcomeMessage: ''
  }

  isClient () {
    return this.props.type === 'client' || this.isClientOverlay()
  }

  isClientOverlay () {
    return this.props.type === 'client-overlay'
  }

  isAgent () {
    return this.props.type === 'agent'
  }

  getMyName () {
    if (this.isAgent()) {
      return advisers[this.state.selectedAdviser].name
    }
    return this.state.myName
  }

  userIsTyping () {
    return this.state.whoIsTyping
  }

  // Executes after a while to clean the typing notification in case people
  // disconnect or stop sending events. _.debounce call is in componentDidMount.
  handleTypingCleanup () {
    this.setState({ whoIsTyping: '' })
  }

  handleWebchatAdviser ({ selectedAdviser }) {
    this.setState({ selectedAdviser })
  }

  handleWebchatConnect () {
    if (this.state.welcomeMessage && this.isAgent()) {
      const author = this.getMyName()
      const content = this.state.welcomeMessage
      const time = Date.now()
      this.socket.emit('message', {
        type: 'WEBCHAT_MESSAGE',
        payload: { author, content, time }
      })
      this.socket.emit('message', {
        type: 'WEBCHAT_ADVISER',
        payload: { selectedAdviser: this.state.selectedAdviser }
      })
    }
    this.setState({ userConnected: true })
  }

  handleWebchatMessage (payload) {
    this.setState({ messages: [...this.state.messages, payload] })
  }

  handleWebchatTyping (payload) {
    const whoIsTyping = payload.name
    const isTyping = payload.isTyping
    const isOtherPerson = whoIsTyping !== this.getMyName()
    if (isOtherPerson) {
      if (isTyping) {
        this.setState({ whoIsTyping })
        this.handleTypingCleanup()
      } else {
        this.setState({ whoIsTyping: '' })
      }
    }
  }

  handleWebchatQueueDecrement ({ value }) {
    this.setState({ queueSize: value })
    if (value < 1) {
      this.changeToConversation()
    }
  }

  handleChatMessageReceived ({ type, payload }) {
    switch (type) {
      case 'WEBCHAT_ADVISER':
        this.handleWebchatAdviser(payload)
        break
      case 'WEBCHAT_CONNECT':
        this.handleWebchatConnect(payload)
        break
      case 'WEBCHAT_MESSAGE':
        this.handleWebchatMessage(payload)
        break
      case 'WEBCHAT_TYPING':
        this.handleWebchatTyping(payload)
        break
      case 'WEBCHAT_QUEUE_DECREMENT':
        this.handleWebchatQueueDecrement(payload)
        break
      default:
        console.warn('Unknown webchat message received!')
        console.warn('Type:', type)
        console.warn('Payload:', payload)
    }
  }

  componentDidMount () {
    this.socket = io()
    this.socket.on('message', this::this.handleChatMessageReceived)

    this.handleTypingCleanup = _.debounce(this.handleTypingCleanup, 3000)

    if (this.isClientOverlay()) {
      Array.from(document.querySelectorAll('.js-trigger-custom-overlay'))
        .forEach((el) => el.addEventListener('click', this::this.handleOverlayShow))
    }
  }

  handleMessageChange (currentMessage) {
    const isTyping = currentMessage.length
    this.socket.emit('message', {
      type: 'WEBCHAT_TYPING',
      payload: {
        name: this.getMyName(),
        isTyping
      }
    })
    this.setState({ currentMessage })
  }

  handleMessageSubmit () {
    const author = this.getMyName()
    const content = this.state.currentMessage
    const time = Date.now()
    this.socket.emit('message', {
      type: 'WEBCHAT_MESSAGE',
      payload: { author, content, time }
    })
    this.socket.emit('message', {
      type: 'WEBCHAT_TYPING',
      payload: {
        name: author,
        isTyping: false
      }
    })
    this.setState({ currentMessage: '' })
  }

  handleAdviserChange (idx) {
    this.handleNameChange(advisers[idx].name)
    this.setState({ selectedAdviser: idx })
  }

  handleNameChange (myName) {
    this.setState({ myName })
  }

  handleOverlayToggle () {
    const overlayMinimized = !this.state.overlayMinimized
    this.setState({ overlayMinimized })
  }

  handleOverlayShow () {
    this.setState({ overlayVisible: true, overlayMinimized: false })
  }

  handleOverlayHide () {
    this.setState({ overlayVisible: false })
  }

  handleWelcomeMessageChange (welcomeMessage) {
    this.setState({ welcomeMessage })
  }

  handleQueueDecrement () {
    this.socket.emit('message', {
      type: 'WEBCHAT_QUEUE_DECREMENT',
      payload: { value: this.state.queueSize - 1 }
    })
  }

  changeToIntro () {
    this.setState({ step: 'intro' })
  }

  changeToQueue () {
    this.setState({ step: 'queue' })
    if (this.isClient()) {
      this.socket.emit('message', {
        type: 'WEBCHAT_CONNECT',
        payload: { name: this.getMyName() }
      })
    }
  }

  changeToConversation () {
    this.setState({ step: 'conversation' })
  }

  changeToAreYouSure () {
    this.setState({
      previousStep: this.state.step,
      step: 'are-you-sure'
    })
  }

  changeToEnd () {
    this.setState({ step: 'end' })
  }

  changeToPrevious () {
    this.setState({
      previousStep: this.state.step,
      step: this.state.previousStep
    })
  }

  renderCurrentStep () {
    switch (this.state.step) {
      case 'intro':
        if (this.isAgent()) {
          return <WebchatIntroAgent
            advisers={advisers}
            handleAdviserChange={this::this.handleAdviserChange}
            handleWelcomeMessageChange={this::this.handleWelcomeMessageChange}
            handleSubmit={this::this.changeToQueue}
            selectedAdviser={this.state.selectedAdviser}
            welcomeMessage={this.state.welcomeMessage}
          />
        } else {
          return <WebchatIntroClient
            handleNameChange={this::this.handleNameChange}
            handleSubmit={this::this.changeToQueue}
            name={this.getMyName()}
          />
        }
      case 'queue':
        return <WebchatQueue
          handleQueueDecrement={this::this.handleQueueDecrement}
          isAgent={this.isAgent()}
          queueSize={this.state.queueSize}
          userConnected={this.state.userConnected}
          welcomeMessage={this.state.welcomeMessage}
        />
      case 'conversation':
        return <WebchatConversation
          adviser={advisers[this.state.selectedAdviser]}
          currentMessage={this.state.currentMessage}
          handleMessageChange={this::this.handleMessageChange}
          handleMessageSubmit={this::this.handleMessageSubmit}
          isAgent={this.isAgent()}
          messages={this.state.messages}
          userIsTyping={this.userIsTyping()}
          name={this.getMyName()}
        />
      case 'are-you-sure':
        return <WebchatAreYouSure
          handleEnd={this::this.changeToEnd}
          handleReturn={this::this.changeToPrevious}
        />
      case 'end':
        return <WebchatEnd
          handleWindowClose={this::this.handleOverlayHide}
        />
    }
  }

  renderOverlay () {
    const {overlayMinimized, overlayVisible} = this.state
    const height = 500
    let transformContainer = ''
    if (overlayVisible) {
      if (overlayMinimized) {
        transformContainer = `translate3d(0, calc(${height}px - 2.5rem), 0)`
      } else {
        transformContainer = 'translate3d(0, 0, 0)'
      }
    } else {
      transformContainer = `translate3d(0, ${height}px, 0)`
    }

    return <div
      className="ba bb-0 b--govuk-gray-1 bg-white fixed bottom-0 right-0 right-2-ns transition-transform w-100 mw6-ns"
      style={{
        height,
        transform: transformContainer,
        zIndex: 1
      }}
    >
      <div className="pa2 bg-govuk-black-1 white flex justify-between">
        <span
          className="flex pointer transition-transform"
          onClick={this::this.handleOverlayToggle}
        >
          <IconExpandMore flipVertical={overlayMinimized} />
          <span className="ml1">{(overlayMinimized) ? 'show chat' : 'hide'}</span>
        </span>
        <span
          className="flex pointer"
          onClick={this::this.changeToAreYouSure}
        >
          <span className="mr1">close</span>
          <IconClear />
        </span>
      </div>
      <div className="ph2 center mw6-ns" style={{
        height: 'calc(100% - 3rem)'
      }}>
        {this.renderCurrentStep()}
      </div>
    </div>
  }

  render () {
    if (this.isClientOverlay()) {
      return this.renderOverlay()
    }

    return <div className="f4 h-100">
      {this.renderCurrentStep()}
    </div>
  }
}
