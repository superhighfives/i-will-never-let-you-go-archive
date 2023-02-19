import React from 'react'

export default class Links extends React.Component {
  constructor() {
    super()
  }
  componentDidMount() {
    // console.log("Mounted: Links")
  }
  render() {
    let Extra = this.props.extra ? this.props.extra : null
    let iconYoutube = '<use xlink:href="#icon-youtube" />'
    let iconBandcamp = '<use xlink:href="#icon-bandcamp" />'
    let iconSoundcloud = '<use xlink:href="#icon-soundcloud" />'
    let iconTwitter = '<use xlink:href="#icon-twitter" />'
    let iconFacebook = '<use xlink:href="#icon-facebook" />'
    return <div className="options-list">
      {Extra}
      <a className="options-list__item" href="http://youtu.be/1ikrtVm5T5c" target="_blank">
        <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconYoutube }} />
        Watch on <strong>YouTube</strong>
      </a>
      <a className="options-list__item" href="http://music.wearebrightly.com" target="_blank">
        <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconBandcamp }} />
        Buy on <strong>Bandcamp</strong>
      </a>
      <a className="options-list__item" href="http://soundcloud.com/wearebrightly" target="_blank">
        <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconSoundcloud }} />
        Listen on <strong>Soundcloud</strong>
      </a>
      <a className="options-list__item" href="http://twitter.com/wearebrightly" target="_blank">
        <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconTwitter }} />
        Follow via <strong>Twitter</strong>
      </a>
      <a className="options-list__item" href="http://facebook.com/wearebrightly" target="_blank">
        <svg className="options-list__icon" dangerouslySetInnerHTML={{__html: iconFacebook }} />
        Like via <strong>Facebook</strong>
      </a>
    </div>
  }
}