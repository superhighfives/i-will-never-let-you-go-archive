import React from 'react'
import Links from '../views/Links'
import Actions from '../events/Actions'

export default class Outro extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Outro")
  }
  handleClick(event) {
    Actions.start()
  }
  render() {
    let iconReplay = '<use xlink:href="#icon-replay" />'
    var replay = <a className="options-list__item--reversed" onClick={this.handleClick} href="#">
      <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconReplay }} />
      Replay
    </a>
    return <div className="view outro">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">I Will Never Let You Go</h1>
        <h2 className="heading-block__subtitle">Thank You For Listening</h2>
      </hgroup>
      <Links extra={replay} />
    </div>
  }
}