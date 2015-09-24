import React from 'react'
import Actions from '../events/Actions'

export default class WebcamError extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Error")
  }
  handleStart(event) {
    Actions.start()
  }
  render() {
    let iconSkip = '<use xlink:href="#icon-skip" />'
    return <div className="view error">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">Hmmmm...</h1>
        <h2 className="heading-block__subtitle">Looks like we had an issue initialising your webcam.</h2>
        <p className="heading-block__note">(Psst... {this.props.message})</p>
      </hgroup>
      <div className="error__options">
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