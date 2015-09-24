import React from 'react'
import Actions from '../events/Actions'

export default class WebcamInitialisation extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Webcam Initialisation")
  }
  handleStart(event) {
    Actions.start()
  }
  handleWebcam(event) {
    Actions.initiateWebcam()
  }
  render() {
    let iconWebcam = '<use xlink:href="#icon-webcam" />'
    let iconSkip = '<use xlink:href="#icon-skip" />'
    return <div className="view webcam">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">Before we start</h1>
        <h2 className="heading-block__subtitle">Would you like to be a part of it?</h2>
      </hgroup>
      <div className="webcam__options">
        <a onClick={this.handleWebcam} className="options-box" href="#">
          <div className="options-box__icon">
            <svg className="icon" dangerouslySetInnerHTML={{__html: iconWebcam }} />
          </div>
          Use your webcam
        </a>
        <a onClick={this.handleStart} className="options-box" href="#">
          <div className="options-box__icon">
            <svg className="icon" dangerouslySetInnerHTML={{__html: iconSkip }} />
          </div>
          Skip
        </a>
      </div>
    </div>
  }
}