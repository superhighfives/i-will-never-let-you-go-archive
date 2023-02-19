import 'whatwg-fetch'
import ImgurCredentials from '../../../credentials-imgur'

export default {
  getAlbum() {
    return fetch('https://api.imgur.com/3/album/' + ImgurCredentials.album.id, {
      method: 'get',
      headers: {
        "Authorization": "Client-ID " + ImgurCredentials.clientId
      }
    }).then(response => response.json())
  },
  addToAlbum(id) {
    return fetch('https://api.imgur.com/3/album/' + ImgurCredentials.album.hash + '/add', {
      method: 'post',
      body: "ids:" + id,
      headers: {
        "Authorization": "Client-ID " +  + ImgurCredentials.clientId
      }
    }).then(response => response.json())
  },
  uploadSingleImage(image) {
    let data = new FormData()
    data.append("image", image)
    data.append("type", "base64")
    data.append("album", ImgurCredentials.album.hash)
    return fetch('https://api.imgur.com/3/image', {
      method: 'post',
      body: data,
      headers: {
        "Authorization": "Client-ID " + ImgurCredentials.clientId
      }
    }).then(response => response.json())
  },
  createAlbum() {
    let data = new FormData()
    data.append("title", "I Will Never Let You Go")
    return fetch('https://api.imgur.com/3/album', {
      method: 'post',
      body: data,
      headers: {
        "Authorization": "Client-ID " + ImgurCredentials.clientId
      }
    }).then(response => response.json())
  }
}
