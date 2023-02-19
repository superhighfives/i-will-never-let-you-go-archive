import Actions from '../events/Actions'

export default class ImgurCanvas {
  constructor(webcam) {
    this.webcam = webcam
    this.createCanvas()
    this.setupCanvas()
    this.attachEvents()
  }

  createCanvas() {
    this.webcamCanvas = document.createElement('canvas')
    this.webcamCanvas.id = "webcamCanvas"
    this.webcamContext = this.webcamCanvas.getContext('2d')
  }

  attachEvents() {
    this.webcam.addEventListener('canplay', this.setupCanvas.bind(this))
  }

  setupCanvas() {
    if (!this.webcamStreaming) {
      this.webcamCanvas.width = this.webcam.videoWidth * 3
      this.webcamCanvas.height = this.webcam.videoHeight
      this.webcamStreaming = true
      this.captureImage()
        .then(function(response) {
          Actions.imageCaptured(response)
        })
    }
  }

  desaturateImage(imageData) {
    var data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
      data[i] = bright
      data[i + 1] = bright
      data[i + 2] = bright
    }
    return imageData
  }
  
  captureImage() {
    return new Promise((resolve, reject) => {
      if (this.webcam.paused || this.webcam.ended) return
      let totalSnapshots = 3
      let promises = []
      for (let i = 0; i < totalSnapshots; i++) {
        var promise = new Promise((resolve, reject) => {
          setTimeout(() => {
            let xPosition = i * this.webcam.videoWidth
            this.webcamContext.drawImage(this.webcam, xPosition, 0, this.webcam.videoWidth, this.webcamCanvas.height)
            resolve()
          }, 10000 * (i + 1))
        })
        promises.push(promise)
      }

      Promise.all(promises).then(() => {
        var imageData = this.webcamContext.getImageData(0, 0, this.webcamCanvas.width, this.webcamCanvas.height)
        this.webcamContext.putImageData(this.desaturateImage(imageData), 0, 0)
        var image = this.webcamCanvas.toDataURL('image/jpeg', 0.8).split(',')[1]
        resolve(image)
      })
    })
  }
}