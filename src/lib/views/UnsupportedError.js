import React from 'react'
import Links from '../views/Links'
import Actions from '../events/Actions'

export default class UnsupportedError extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Error")
  }
  render() {
    return <div className="view error error--unsupported">
      <hgroup className="heading-block">
        <h1 className="heading-block__title">Okay...</h1>
        <h2 className="heading-block__subtitle">So, it looks like your browser cannot play this video.</h2>
        <p className="heading-block__note">(But we have options)</p>
      </hgroup>
      <Links />
    </div>
  }
}