import React from 'react'
import Actions from '../events/Actions'
import Dispatcher from '../events/Dispatcher'
import Constants from '../constants/Constants'

export default class Intro extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {
    // console.log("Mounted: Intro")

    Dispatcher.register((action) => {
      switch(action.actionType) {
        case Constants.ACTION_CAN_PLAY_THROUGH:
          this.setState({readyToStart: true})
          break
        case Constants.ACTION_SINGLE_TRACK:
          this.setState({readyToStart: true, skipSetup: true})
          break
      }
    })
  }
  handleClick(event) {
    if(!this.handled) {
      if(this.state.skipSetup) {
        Actions.start()
      } else {
        Actions.promptWebcam()
      }
      this.handled = true
    }
  }
  render() {
    let iconPlay = '<use xlink:href="#icon-play-circle" />'
    let iconSpinner = '<use xlink:href="#icon-spinner" />'
    return <div className="view intro">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">Brightly</h1>
        <h2 className="heading-block__subtitle">I Will Never Let You Go</h2>
        <h2 className="heading-block__note">(A real-time WebGL-powered music video)</h2>
      </hgroup>
      { this.state.readyToStart
        ? <a onTouchStart={this.handleClick.bind(this)} onClick={this.handleClick.bind(this)} href="#" className="intro__play">
            <svg className="icon--lg" dangerouslySetInnerHTML={{__html: iconPlay }} />
          </a>
        : <svg className="icon--lg icon--spinning" dangerouslySetInnerHTML={{__html: iconSpinner }} />
      }
    </div>
  }
}
