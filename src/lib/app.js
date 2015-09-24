import React from 'react'
import ReactAddonsCSSTransitionGroup from 'react-addons-css-transition-group'
import {Modernizr} from './vendor/modernizr'
import Dispatcher from './events/Dispatcher'
import Constants from './constants/Constants'
import Urls from './constants/Urls'
import Actions from './events/Actions'
import ImgurUpload from './components/ImgurUpload'
import Images from './components/Images'
import VideoPlayer from './views/VideoPlayer'
import ClassNames from 'classnames'
import 'whatwg-fetch'

export default class App extends React.Component {
  constructor() {
    super()
    let isIphone = navigator.userAgent.match(/(iPhone|iPod)/)
    this.supported = Modernizr.webgl && Modernizr.video && Modernizr.flexbox && !isIphone
    this.state = {view: this.supported ? Constants.VIEW_INTRO : Constants.VIEW_UNSUPPORTED_ERROR, buffering: false, approvalRequired: false, webcam: false}
    Modernizr.on('videoautoplay', (result) => { this.setState({singleTrack: !result}) })
    this.updateView(this.state.view)
    if(isIphone) {
      document.ontouchmove = function(event) {
        event.preventDefault()
      }
    }
  }
  componentDidMount() {
    // console.log("Mounted: App")

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    if(this.supported) {
      /* PRELOAD SCHOOL OF WITCHCRAFT AND WIZARDRY */
      this.getImages()
      this.preloader = document.createElement("video")
      this.preloader.volume = 0
      this.preloader.src = Urls.mainVideoUrl
      this.preloader.play()
      // console.log("PRELOADING")
      let startedAt = window.performance.now()
      this.preloader.addEventListener('canplaythrough', _ => {
        console.log(`PRELOADED VIDEO IN ${(performance.now() - startedAt) / 1000} seconds`)
        // this.setState({readyToStart: true})
        Actions.canPlayThrough()
      })
    }

    Dispatcher.register((action) => {
      switch(action.actionType) {
        case Constants.ACTION_INITIATE_UNSUPPORTED:
          // console.log("Dispatching: Unsupported Error")
          this.setState({view: Constants.VIEW_UNSUPPORTED_ERROR})
          break
        case Constants.ACTION_PROMPT_WEBCAM:
          // console.log("Dispatching: Webcam Initialisation")
          this.setState({view: Constants.VIEW_WEBCAM_PROMPT})
          break
        case Constants.ACTION_INITIATE_WEBCAM_SUCCESS:
          console.log("ACTION_INITIATE_WEBCAM_SUCCESS")
          this.setState({webcam: true})
          break
        case Constants.ACTION_INITIATE_WEBCAM_FAILURE:
          // console.log("Dispatching: Webcam Error")
          this.setState({view: Constants.VIEW_WEBCAM_ERROR, message: action.message})
          break
        case Constants.ACTION_START:
          // console.log("Dispatching: Playing")
          if(this.preloader) {
            this.preloader.pause()
            this.preloader.src = ""
            this.preloader = null
          }
          this.setState({view: Constants.VIEW_VIDEO, message: this.state.webcam})
          break
        case Constants.ACTION_BUFFERING_VIDEO:
          // console.log("Dispatching: Buffering " + action.message)
          this.setState({buffering: action.message})
          break
        case Constants.ACTION_IMAGE_CAPTURED:
          // console.log("Dispatching: Captured image")
          this.setState({capturedImage: action.message, approvalRequired: true})
          break
        case Constants.ACTION_END:
          // console.log("Dispatching: Outro")
          if(this.state.approvalRequired) {
            this.setState({view: Constants.VIEW_APPROVAL})
          } else {
            this.setState({view: Constants.VIEW_OUTRO})
          }
          break
        case Constants.ACTION_APPROVED:
          // console.log("Dispatching: Approved")
          this.setState({view: Constants.VIEW_OUTRO, approvalRequired: false})
          break
        case Constants.ACTION_UPLOAD_IMAGE:
          // console.log("Dispatching: Upload image")
          this.uploadImage()
          this.setState({view: Constants.VIEW_OUTRO, approvalRequired: false})
          break
      }
    })
  }
  componentWillUpdate(props, state) {
    if(state.view) {
      this.updateView(state.view)
    }
    if(state.singleTrack) {
      Actions.setupSingleTrack()
    }
  }
  uploadImage() {
    ImgurUpload.uploadSingleImage(this.state.capturedImage)
      .then((response) => {
        if(response.success) {
          // console.log(response.data)
          var metadata = {
            id: response.data.id,
            deletehash: response.data.deletehash,
            width: response.data.width,
            height: response.data.height
          }
          console.log(metadata)
        }
      })
  }
  getImages() {
    ImgurUpload.getAlbum()
      .then((response) => {
        if(response.success) {
          Images.loadAll(response.data)
            .then((response) => {
              Actions.loadedImages(response)
            })
        }
      })
  }
  updateView(view) {
    // console.log("App state changed", view)
    this.view = view
  }
  render() {
    let ReactCSSTransitionGroup = ReactAddonsCSSTransitionGroup
    // console.log("Rendering stage")
    let stageClasses = ClassNames({
      'stage-wrapper': true,
      'is-buffering': this.state.buffering
    })
    let iconSpinner = '<use xlink:href="#icon-spinner" />'
    let VideoPlayerElement = this.supported ? <VideoPlayer /> : null
    let View = this.view
    return <div className={stageClasses}>
      { this.state.buffering
        ? <div className="buffering">
            <svg className="icon--lg icon--spinning icon--buffering" dangerouslySetInnerHTML={{__html: iconSpinner }} />
            <span className="buffering__status">Buffering...</span>
          </div>
        : null
      }
      {VideoPlayerElement}
      <ReactCSSTransitionGroup component="div" className="stage" transitionName="stage" transitionAppear={true} transitionEnter={true} transitionLeave={true}>
        <View key={this.state.view} message={this.state.message} capturedImage={this.state.capturedImage} />
      </ReactCSSTransitionGroup>
    </div>
  }
}
