export default {
  loadAll(data) {
    var totalImages = 10
    return new Promise((resolve, reject) => {
      let promises = []
      let images = data.images.slice(-totalImages)
      images.forEach((imageData) => {
        var promise = new Promise((resolve, reject) => {
          var image = new Image()
          image.onload = (() => resolve(image))
          image.src = imageData.link.replace(/^http:\/\//,'https://')
        })
        promises.push(promise)
      })

      Promise.all(promises).then((response) => {
        resolve(response)
      })
    })
  }
}
