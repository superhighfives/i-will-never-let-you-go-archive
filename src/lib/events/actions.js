import Dispatcher from './Dispatcher'
import Constants from '../constants/Constants'

export default class Actions {
  static start() {
    // console.log("Action: Start")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_START
    })
  }
  static promptWebcam() {
    // console.log("Action: Prompt Webcam")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_PROMPT_WEBCAM
    })
  }
  static initiateWebcam() {
    // console.log("Action: Initiate Webcam")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_INITIATE_WEBCAM
    })
  }
  static webcamInitiated() {
    // console.log("Action: Initiate Webcam")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_INITIATE_WEBCAM_SUCCESS
    })
  }
  static bufferingVideo(buffering) {
    // console.log("Action: Buffering Video " + buffering)
    Dispatcher.dispatch({
      actionType: Constants.ACTION_BUFFERING_VIDEO,
      message: buffering
    })
  }
  static initiateWebcamFailure(err) {
    // console.log("Action: Initiate Webcam Failure")
    let errorMessages = {
      PermissionDismissedError: "We couldn't access it.",
      PermissionDeniedError: "We couldn't access it.",
      NotFoundError: "We couldn't find one.",
      MandatoryUnsatisfiedError: "It looks like it's not compatible."
    }
    Dispatcher.dispatch({
      actionType: Constants.ACTION_INITIATE_WEBCAM_FAILURE,
      message: errorMessages[err.name] || "Something weird happened."
    })
  }
  static imageCaptured(image) {
    // console.log("Action: Can capture image")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_IMAGE_CAPTURED,
      message: image
    })
  }
  static canPlayThrough() {
    // console.log("Action: Can play through")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_CAN_PLAY_THROUGH
    })
  }
  static ended() {
    // console.log("Action: Ended")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_END
    })
  }
  static approved() {
    // console.log("Action: Approved")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_APPROVED
    })
  }
  static uploadImage() {
    // console.log("Action: Upload image")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_UPLOAD_IMAGE
    })
  }
  static loadedImages(images) {
    // console.log("Action: Loaded images")
    Dispatcher.dispatch({
      actionType: Constants.ACTION_LOADED_IMAGES,
      message: images
    })
  }
  static setupSingleTrack() {
    Dispatcher.dispatch({
      actionType: Constants.ACTION_SINGLE_TRACK
    })
  }
}