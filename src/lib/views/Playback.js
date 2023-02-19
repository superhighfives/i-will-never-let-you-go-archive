import React from 'react'
import ClassNames from 'classnames'

export default class Playback extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Playback")
  }
  render() {
    let playbackItemClasses = ClassNames({
      'playback__item': true,
      'playback__item--unsupported': !this.props.message
    })
    return <div className="view playback">
      <p className="playback__item">This is an interactive video.</p>
      <p className={playbackItemClasses}><strong>You are a part of it.</strong></p>
      <p className="playback__item">So are other people.</p>
    </div>
  }
}