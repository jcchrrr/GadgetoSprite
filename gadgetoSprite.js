export default class GadgetoSprite {
  constructor (data) {
    this._wrap = data.wrap // Required
    this._src = data.src // Required
    this._rows = data.rows // Required
    this._cols = data.cols // Required
    this._frames = data.frames ? parseInt(data.frames, 10) : parseInt(data.cols * data.rows, 10) // Default to rows * cols
    this._fps = data.fps ? data.fps : 30 // Default to 30
    this._autoplay = data.autoplay === 'true' // Default to false
    this._loop = data.loop === 'true' // Default to false
  }

  init () {
    this.loader(this._src)
      .then(() => {
        this._pos = 0
        this._left = 0
        this._top = 0
        this._height = this._img.height
        this._width = this._img.width
        this._frameHeight = this._img.height / this._rows
        this._frameWidth = this._img.width / this._cols

        this.setStyle()
        if (this._autoplay) this.play()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  loader (src) {
    return new Promise((resolve, reject) => {
      this._img = new Image()
      this._img.onload = () => {
        resolve()
      }
      this._img.onerror = (err) => {
        reject(err)
      }
      this._img.src = src
    })
  }

  setStyle () {
    Object.assign(this._wrap.style, {
      height: `${this._frameHeight}px`,
      width: `${this._frameWidth}px`,
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url(${this._src})`,
      backgroundPosition: '-0px -0px'
    })
  }

  play () {
    this._anim = setInterval(() => {
      this._pos < this._frames ? this._pos += 1 : this._pos = 1

      this._left = ((this._pos % this._cols === 0 ? this._cols : this._pos % this._cols) - 1) * this._frameWidth * -1
      this._top = (Math.ceil(this._pos / this._cols, 10) - 1) * this._frameHeight * -1

      const newPos = `${this._left}px ${this._top}px`

      Object.assign(this._wrap.style, {
        backgroundPosition: newPos
      })

      if (!this._loop && this._pos === this._frames) {
        clearInterval(this._anim)
      }
    }, 1000 / this._fps)
  }

  pause () {
    clearInterval(this._anim)
  }
}
