import THREE from 'three'
import vertexShader from './vertex.glsl!text'
import fragmentShader from './fragment.glsl!text'

export default class Scene {
  constructor(container) {
    this.container = container
    this.scene = new THREE.Scene()
    this.setupRenderer()
    this.setupCamera()
    this.setupVideoTexture()
    this.setupWebcamTexture()
    this.setupVariables()
    this.setupMaterial()
    this.setupGeometry()
    this.animate()
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.container.appendChild(this.renderer.domElement)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  getSizes() {
    let aspect = 9/16
    let width = window.innerWidth
    let height = window.innerHeight
    return {
      left: aspect * width / -2,
      right: aspect * width / 2,
      top: height / 2,
      bottom: height / -2
    }
  }

  setupCamera() {
    let sizes = this.getSizes()
    this.camera = new THREE.OrthographicCamera(sizes.left, sizes.right, sizes.top, sizes.bottom, 0, 10)
    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = 1
  }

  setupGhosts(ghosts) {
    this.ghostsInitialised = true
    this.ghosts = ghosts
    this.totalGhosts = this.ghosts.length
    this.setupGhostTextures()
  }

  setupWebcam() {
    this.webcamInitialised = true
  }

  setupVideoTexture() {
    this.video = this.container.querySelector('.player__video')
    this.videoTexture = new THREE.Texture(this.video)
    this.videoTexture.minFilter = THREE.LinearFilter
    this.videoTexture.magFilter = THREE.LinearFilter
  }

  setupWebcamTexture() {
    this.webcam = this.container.querySelector('.player__webcam')
    this.webcamTexture = new THREE.Texture(this.webcam)
    this.webcamTexture.minFilter = THREE.LinearFilter
    this.webcamTexture.magFilter = THREE.LinearFilter
  }

  setupGhostTextures() {
    this.currentGhostTexture = 0
    this.ghostTextures = []
    THREE.ImageUtils.crossOrigin = ''
    this.ghosts.forEach((ghost) => {
      ghost.crossOrigin = ''
      let ghostTexture = THREE.ImageUtils.loadTexture(ghost.src)
      ghostTexture.minFilter = THREE.LinearFilter
      ghostTexture.magFilter = THREE.LinearFilter
      ghostTexture.onload = () => {
        ghostTexture.needsUpdate = true
      }
      this.ghostTextures.push(ghostTexture)
      setInterval(() => {
        this.ghostNr = (this.ghostNr + 1) % 3
        this.uniforms.ghostNr.value = this.ghostNr
      }, 50)
    })
  }

  setupVariables() {
    this.videoNr = 0
    this.ghostNr = 0
    this.ghostVisible = 0
    this.webcamVisible = 0
    this.webcamStreaming = 0
  }

  showVideo(frame) {
    this.switchToVideo()
    this.uniforms.videoNr.value = frame - 1
    return this.uniforms.videoNr.value + 1
  }

  switchToVideo() {
    this.webcamVisible = false
    this.uniforms.webcamVisible.value = this.webcamVisible
    this.ghostVisible = false
    this.uniforms.ghostVisible.value = this.ghostVisible
    return this.uniforms.videoNr.value + 1
  }
  
  showWebcam() {
    if(this.webcamInitialised) {
      this.webcamVisible = true
      this.uniforms.webcamVisible.value = this.webcamVisible
      if(this.webcamVisible) {
        return 3;
      } else {
        return this.uniforms.videoNr.value + 1;
      }
    }
  }
  
  showGhost() {
    if(this.ghostsInitialised) {
      this.uniforms.ghost.value = this.ghostTextures[(this.currentGhostTexture++) % this.totalGhosts]
      this.ghostVisible = true
      this.uniforms.ghostVisible.value = Number(this.ghostVisible)
    }
  }

  getCurrentVideoFrame() {
    return this.uniforms.videoNr.value
  }

  resetImages() {
    if(this.webcamInitialised) {
      this.showWebcam()
    } else {
      this.showVideo(1)
    }
  }

  setupMaterial() {
    this.uniforms = {
      video: {
        type: 't',
        value: this.videoTexture
      },
      videoNr: {
        type: 'i',
        value: this.videoNr
      },
      webcam: {
        type: 't',
        value: this.webcamTexture
      },
      webcamVisible: {
        type: 'i',
        value: this.webcamVisible
      },
      ghost: {
        type: 't',
        value: null
      },
      ghostNr: {
        type: 'i',
        value: this.ghostNr
      },
      ghostVisible: {
        type: 'i',
        value: this.ghostVisible
      },
      underlay: {
        type: 't',
        value: THREE.ImageUtils.loadTexture("/media/texture.jpg")
      }
    }
    this.material = new THREE.ShaderMaterial({vertexShader, fragmentShader, uniforms: this.uniforms})
  }

  getGeometrySize() {
    let width = window.innerWidth
    let height = window.innerHeight
    if(height >= width) {
      return Math.max(width, height)
    } else {
      return Math.min(width, height)
    }
  }

  setupGeometry() {
    let size = this.getGeometrySize()
    this.geometry = new THREE.PlaneGeometry(size, size, 1, 1)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  updateGeometry() {
    this.scene.remove(this.mesh)
    let size = this.getGeometrySize()
    this.geometry = new THREE.PlaneGeometry(size, size, 1, 1)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  onWindowResize() {
    this.updateGeometry()
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    let sizes = this.getSizes()
    this.camera.left = sizes.left
    this.camera.right = sizes.right
    this.camera.top = sizes.top
    this.camera.bottom = sizes.bottom
    this.camera.updateProjectionMatrix()
  }

  animate() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      if (this.videoTexture) this.videoTexture.needsUpdate = true
    }
    if (this.webcam && this.webcam.readyState === this.webcam.HAVE_ENOUGH_DATA) {
      if (this.webcamTexture) this.webcamTexture.needsUpdate = true
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.animate.bind(this))
  }

  static start(view) {
    Scene.instance = new Scene(view)
  }
}
