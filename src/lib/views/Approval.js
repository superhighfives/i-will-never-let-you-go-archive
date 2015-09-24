import React from 'react'
import Actions from '../events/Actions'
import Dispatcher from '../events/Dispatcher'
import Constants from '../constants/Constants'

export default class Approval extends React.Component {
  constructor() {
    super()
    this.state = {image: false}
  }
  componentDidMount() {
    // console.log("Mounted: Approval")
  }
  handleUpload(event) {
    Actions.uploadImage()
  }
  handleCancel(event) {
    Actions.approved()
  }
  render() {
    let iconTick = '<use xlink:href="#icon-tick" />'
    let iconCross = '<use xlink:href="#icon-cross" />'
    let imageStyles = {backgroundImage: "url(data:image/jpeg;base64," + this.props.capturedImage + ")"}
    return <div className="view approval">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">Join the video</h1>
        <h2 className="heading-block__subtitle">Can we use your photos?</h2>
        <p className="heading-block__note">(These frames will be randomly injected into other videos)</p>
      </hgroup>
      <div className="snapshot" style={imageStyles}></div>
      <div className="snapshot-approval">
        <a onClick={this.handleUpload} className="snapshot-approval__option" href="#">
          <svg className="icon" dangerouslySetInnerHTML={{__html: iconTick }} />
        </a>
        <a onClick={this.handleCancel} className="snapshot-approval__option" href="#">
          <svg className="icon" dangerouslySetInnerHTML={{__html: iconCross }} />
        </a>
      </div>
    </div>
  }
}