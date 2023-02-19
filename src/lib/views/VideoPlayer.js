import React from 'react'
import ReactDOM from 'react-dom'
import Scene from '../webgl/Scene'
import Dispatcher from '../events/Dispatcher'
import Constants from '../constants/Constants'
import Actions from '../events/Actions'
import Urls from '../constants/Urls'
import ClassNames from 'classnames'
import ImgurCanvas from '../components/ImgurCanvas'
import Timeline from '../components/Timeline'
import Timings from '../constants/Timings'

export default class VideoPlayer extends React.Component {
  constructor() {
    super()
    this.state = {looping: true, url: this.getUrl(Constants.VIDEO_LOOP), webcam: false, selector: false, displaying: true, playbackRate: "0.8"}
    this.animation = null
    this.selectedFrame = 1
    this.currentTime = 0
    this.chosenVideoTimestamp = 0
  }

  getUrl(video) {
    switch(video) {
      case Constants.VIDEO_LOOP:
        if(this.state && this.state.singleTrack) {
          return Urls.squareLoopVideoUrl
        } else {
          return Urls.loopVideoUrl
        }
        break
      case Constants.VIDEO_MAIN:
        if(this.state && this.state.singleTrack) {
          return Urls.squareMainVideoUrl
        } else {
          return Urls.mainVideoUrl
        }
        break
    }
  }

  componentDidMount() {
    // console.log("Mounted: Video Player")

    let domNode = ReactDOM.findDOMNode(this)
    Scene.start(domNode)

    Dispatcher.register((action) => {
      switch (action.actionType) {
        case Constants.ACTION_START:
          // console.log("Playing: Video")
          this.setState({displaying: false})
          setTimeout(() => {
            this.setState({displaying: true, looping: false, url: this.getUrl(Constants.VIDEO_MAIN), selector: true, playbackRate: "1"})
          }, 5000)
          break
        case Constants.ACTION_INITIATE_WEBCAM:
          // console.log("Initiating: Webcam")
          this.setState({webcam: true})
          break
        case Constants.ACTION_END:
          // console.log("Playing: Loop")
          this.setState({looping: true, url: this.getUrl(Constants.VIDEO_LOOP), selector: false, ended: true})
          break
        case Constants.ACTION_LOADED_IMAGES:
          // console.log("Initiating: Ghosts")
          this.setState({ghosts: action.message})
          break
        case Constants.ACTION_SINGLE_TRACK:
          // console.log("Initiating: Single Track")
          this.setState({singleTrack: true})
          break
      }
    })

    this.video = domNode.querySelector(".player__video")
    this.webcam = domNode.querySelector(".player__webcam")
    this.selector = domNode.querySelector(".player__selector")
    this.setupVideo(this.video)
    this.setupTimeline()

    // this.setupDebug()
  }

  // setupDebug() {
  //   document.onkeypress = (e) => {
  //     let charcode = (typeof e.which == "number") ? e.which : e.keyCode
  //     let key = "";
  //     switch(charcode) {
  //       case 120:
  //         key = "x"
  //         break
  //       case 121:
  //         key = "y"
  //         break
  //       case 119:
  //         key = "w"
  //         break
  //       case 103:
  //         key = "g"
  //         break
  //     }
  //     console.log(`{time: ${this.video.currentTime.toFixed(2)}, code: "${key}|"}`)
  //   }
  // }

  componentWillUpdate(props, state) {
    // console.log("Video Player state changed")

    if(state.webcam && !this.webcamInitiated) {
      this.setupWebcam(this.webcam)
    }

    if(state.ghosts && !this.ghostsInitiated) {
      this.setupGhosts(state.ghosts)
    }

    if(state.selectedFrame) {
      this.selectedFrame = state.selectedFrame
    }

    if(state.playbackRate) {
      this.video.playbackRate = state.playbackRate
    }

    if(state.disableSwitching) {
      this.disableSwitching = true;
      setTimeout(function () {
        this.setState({disableSwitching: false})
        this.disableSwitching = false;
      }.bind(this), 4000)
    }
  }

  componentDidUpdate(props, state) {
    if(state.url) {
      this.video.play()
    }
  }

  setupWebcam(webcam) {
    this.webcamInitiated = true
    let videoSettings = {
      video: {
        mandatory: {
          minWidth: 720,
          minHeight: 480
        }
      }
    }
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
    if (navigator.getUserMedia) {
      navigator.getUserMedia(videoSettings, function (stream) {
        webcam.src = window.URL.createObjectURL(stream)
        webcam.onloadedmetadata = function (e) {
          // console.log("Webcam media loaded")
          Scene.instance.setupWebcam()
          new ImgurCanvas(webcam)
          Actions.webcamInitiated()
          Actions.start()
        }
      }, function (err) {
        // console.log("Webcam media failed", err)
        Actions.initiateWebcamFailure(err)
      })
    } else {
      // console.log("GetUserMedia not supported")
      Actions.initiateWebcamFailure({})
    }
  }

  setupGhosts(ghosts) {
    this.ghostsInitiated = true
    Scene.instance.setupGhosts(ghosts)
  }

  setupVideo(video) {
    // Switch things up for dev
    // video.volume = 0

    // Fire up animation for beats
    this.animation = requestAnimationFrame(this.animate.bind(this))

    this.lastPlayPosition = 0
    this.currentPlayPosition = 0
    this.bufferingDetected = false
    this.checkInterval = 50
    this.bufferInterval = setInterval(this.checkBuffering.bind(this), this.checkInterval)

    video.onended = (e) => {
      // console.log("Video Player: Ended")
      Scene.instance.resetImages()
      Actions.ended()
    }
  }

  checkBuffering(video) {
    if (this.state.url == Urls.mainVideoUrl) {
      this.currentPlayPosition = this.video.currentTime

      // checking offset, e.g. 1 / 50ms = 0.02
      var offset = 1 / this.checkInterval

      // if no buffering is currently detected,
      // and the position does not seem to increase
      // and the player isn't manually paused...
      if ((!this.bufferingDetected
        && this.currentPlayPosition <= (this.lastPlayPosition + offset)
        && !this.video.paused)
        // || (!this.bufferingDetected
        // && this.currentPlayPosition == 0)
      ) {
        // console.log("buffering")
        this.bufferingDetected = true
        Actions.bufferingVideo(this.bufferingDetected)
      }

      // if we were buffering but the player has advanced,
      // then there is no buffering
      if (this.bufferingDetected
        && this.currentPlayPosition > (this.lastPlayPosition + offset)
        && !this.video.paused
      ) {
        // console.log("not buffering anymore")
        this.bufferingDetected = false
        Actions.bufferingVideo(this.bufferingDetected)
      }
      this.lastPlayPosition = this.currentPlayPosition
    } else if (this.bufferingDetected) {
      this.bufferingDetected = false
    }
  }

  setupTimeline() {
    this.timeline = new Timeline()
    Timings.forEach((data) => {
      this.timeline.add(data.time, data.code)
    })
  }

  cueAnimations(timeline) {
    var chain = Promise.resolve()
    // console.log("Time to queue up some videoActions!")
    timeline.forEach((block) => {
      console.log(`Adding ${block.action} for ${block.duration}ms`)
      chain = chain.then(() => {
        return this.videoAction(block.action, block.duration)
      })
    })
    chain.then(() => {
      // console.log("YAY DONE")
      this.videoAction(Constants.TIMELINE_RESET)
    })
  }

  videoAction(action, duration) {
    switch (action) {
      case Constants.TIMELINE_FIRST_VIDEO:
      case Constants.TIMELINE_SECOND_VIDEO:
        this.cueVideo(action)
        break
      case Constants.TIMELINE_WEBCAM:
        this.cueWebcam()
        break
      case Constants.TIMELINE_GHOST:
        this.cueGhost()
        break
      case Constants.TIMELINE_RESET:
        this.cueVideo()
        break
    }

    if (duration) {
      return new Promise(resolve => {
        setTimeout(resolve, duration)
      })
    } else {
      return Promise.resolve()
    }
  }

  cueVideo(video) {
    if (video) {
      // console.log("PLAY VIDEO")
      let frame = video == Constants.TIMELINE_SECOND_VIDEO ? 2 : 1
      let selectedFrame = Scene.instance.showVideo(frame)
      this.setState({selectedFrame: selectedFrame})
    } else {
      // console.log("RESETTING VIDEO")
      let selectedFrame = Scene.instance.switchToVideo()
      this.setState({selectedFrame: selectedFrame})
    }
  }

  cueWebcam() {
    // console.log("PLAY WEBCAM")
    if(this.webcamInitiated) {
      let selectedFrame = Scene.instance.showWebcam()
      this.setState({selectedFrame: selectedFrame})
    } else {
      Scene.instance.showGhost()
    }
  }

  cueGhost() {
    // console.log("PLAY GHOST")
    Scene.instance.showGhost()
  }

  animate(time) {
    if (this.state.url == Urls.mainVideoUrl) {
      let videoTime = Math.ceil(this.video.currentTime)
      if (this.currentTime != videoTime) {
        // console.log(videoTime)
        let timeline = this.timeline.get(this.currentTime)
        let doGlitch = this.chosenVideoTimestamp + 2000 < window.performance.now()
        if (timeline && doGlitch) {
          this.cueAnimations(timeline)
        }
        this.currentTime = videoTime
      }
    }

    this.animation = requestAnimationFrame(this.animate.bind(this))
  }

  handleFirst() {
    // console.log("Video: Displaying first frame")
    let selectedFrame = 1;
    Scene.instance.showVideo(selectedFrame)
    this.chosenVideoTimestamp = window.performance.now()
    this.setState({selectedFrame: selectedFrame, disableSwitching: true})
  }

  handleSecond() {
    // console.log("Video: Displaying second frame")
    let selectedFrame = 2;
    Scene.instance.showVideo(selectedFrame)
    this.chosenVideoTimestamp = window.performance.now()
    this.setState({selectedFrame: selectedFrame, disableSwitching: true})
  }

  handleWebcam() {
    // console.log("Video: Displaying webcam")
    let selectedFrame = 3;
    Scene.instance.showWebcam(true)
    this.chosenVideoTimestamp = window.performance.now()
    this.setState({selectedFrame: selectedFrame, disableSwitching: true})
  }

  render() {
    // console.log("Current state for player: ", this.state)
    let selectorClasses = ClassNames({
      'player__selector': true,
      'selector': true,
      'selector--visible': this.state.selector
    })
    let firstFrameClasses = ClassNames({
      'selector__frame': true,
      'selector__frame--active': this.selectedFrame == 1
    })
    let secondFrameClasses = ClassNames({
      'selector__frame': true,
      'selector__frame--active': this.selectedFrame == 2
    })
    let webcamFrameClasses = ClassNames({
      'selector__frame': true,
      'selector__frame--hidden': !this.webcamInitiated,
      'selector__frame--active': this.selectedFrame == 3
    })
    let playerClasses = ClassNames({
      'player': true,
      'player--hidden': !this.state.displaying
    })
    // console.log("Currently selected frame is: " + this.selectedFrame);
    let iconWebcam = '<use xlink:href="#icon-webcam" />'
    let iconDotsOne = '<use xlink:href="#icon-dots-one" />'
    let iconDotsTwo = '<use xlink:href="#icon-dots-two" />'
    return <div className={playerClasses}>
      <div className={selectorClasses}>
        <span onClick={this.handleFirst.bind(this)} className={firstFrameClasses}>
          <svg className="icon" dangerouslySetInnerHTML={{__html: iconDotsOne }}/>
        </span>
        <span onClick={this.handleSecond.bind(this)} className={secondFrameClasses}>
          <svg className="icon" dangerouslySetInnerHTML={{__html: iconDotsTwo }}/>
        </span>
        <span onClick={this.handleWebcam.bind(this)} className={webcamFrameClasses}>
          <svg className="icon" dangerouslySetInnerHTML={{__html: iconWebcam }}/>
        </span>
      </div>
      <video className="player__video" loop={this.state.looping} src={this.state.url}/>
      <video className="player__webcam" autoPlay/>
    </div>
  }
}
