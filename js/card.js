/** card.js **
 *
 *
**/



;(function cardLoaded(global){
  "use strict"



  let jazyx = global.jazyx
  let classes
  let templates

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(classes = jazyx.classes)) {
    classes = jazyx.classes = {}
  }

  if (!(templates = classes.templates)) {
    templates = classes.templates = {}
  }



  templates.Card = class Card {
    constructor() {
      this.container = document.querySelector("section.output")
    }


    getDisplayData() {
      return {
        display: this.display
      , value: this.value
      }
    }


    generate(layout, images) {
      layout = JSON.parse(JSON.stringify(layout))
      layout = this.adjustCardDetails(layout)

      /// <<< HARD-CODED
      let fontRatio = 5
      this.cueMargin = 0.1
      /// HARD-CODED >>>

      this.images       = images
      this.cardCount    = images.length
      this.createCues   = layout.layout === "flash"
      this.portrait     = layout.orientation === "portrait"

      this.canvasWidth  = layout.canvasWidth
      this.canvasHeight = layout.canvasHeight
      this.columns      = layout.columns
      this.rows         = layout.rows
      this.width        = layout.width
      this.height       = layout.height
      this.borderRadius = layout.borderRadius
      this.borderColour = layout.borderColour[0] === "#"
                        ? layout.borderColour
                        : "#" + layout.borderColour

      this.borders       = layout.borders
      this.strokeStyle  = this._getStrokeStyle()
      this.fontSize     = layout.fontSize * fontRatio
      this.titleFont    = this.fontSize + "px " + layout.font
      this.crop         = layout.crop
      this.pageCount    = this.columns * this.rows

      this.page         = 0
      this.row          = 0
      this.column       = 0

      this.canvasses    = []
      this.treated      = 0

      this.ignored      = 0

      this.container.innerHTML = ""
      images.forEach(this.prepareCard.bind(this))
    }


    prepareCard(cardData, index) {
      if (cardData.ignore) {
        this.ignored += 1
        this.treated += 1
        return
      }

      index -= this.ignored

      let src = cardData.src
      let name = cardData.title

      let left = (index % this.columns) * this.width
      let top  = (Math.floor((index % this.pageCount) / this.columns))
          top *= this.height

      let image = new Image()
      let canvasIndex = Math.floor(index / this.pageCount)

      let loadResult = (event) => {
        if (event.type === "error") {
          return console.log("Image load error:", event)
        }

        let canvas  = this.getCanvas(canvasIndex)
        let context = canvas.getContext("2d")

        this.drawBorder(context, left, top)
        this.drawCard(context, image, left, top)
        this.addText(context, cardData, left, top)
        this.drawStroke(context, left, top)

        this.treated += 1
        let complete = (this.treated === this.cardCount)

        if (complete) {
          this._treatCompleteCanvas(canvas)
        }
      }

      image.onload = image.onerror = loadResult
      image.src = src
    }


    createCue(cardData, index) {
      if (cardData.ignore) {
        this.ignored += 1
        this.treated += 1
        return
      }

      index -= this.ignored

      let title = cardData.title
      let maxWidth = this.width * (1 - 2 * this.cueMargin)
      let minLeft = this.width * this.cueMargin
      let top  = (Math.floor((index % this.pageCount)/this.columns))
      let left

      if (this.portrait) {
        left = (this.columns - (index % this.columns) - 0.5)

      } else {
        left = (index % this.columns) + 0.5
        top = this.rows - 1 - top
      }

      left *= this.width
      top *= this.height

      let canvasIndex = Math.floor(index / this.pageCount)
      let canvas  = this.getCanvas(canvasIndex)
      let context = canvas.getContext("2d")
      context.font = this.titleFont

      this.drawStroke(context, left - this.width / 2, top)

      top += (this.height / 2)

      let width = Math.min(context.measureText(title).width, maxWidth)
      context.save()
      context.translate(left, top)
      if (!this.portrait) {
        context.rotate(Math.PI)
      }
      left = -width / 2
      context.fillText(title, left, this.fontSize / 4, maxWidth)
      context.restore()


      this.treated += 1
      let complete = (this.treated === this.cardCount)

      if (complete) {
        this._treatCompleteCanvas(canvas, "back")
      }
    }


    getCanvas(index) {
      let canvas = this.canvasses[index]

      if (!canvas) {
        canvas = document.createElement("canvas")
        canvas.width       = this.canvasWidth
        canvas.height      = this.canvasHeight

        this.canvasses[index] = canvas

        this.container.appendChild(canvas)
      }

      return canvas
    }


    drawBorder(context, left, top, colour) {
      context.beginPath()
      context.rect(left, top, this.width, this.height)
      context.fill()

      context.beginPath()
      context.fillStyle = "#fff"
      context.rect(
        left + this.borders.left
      , top  + this.borders.top
      , this.width - this.borders.left - this.borders.right
      , this.height - this.borders.top - this.borders.bottom
      )
      context.fill()
    }


    drawCard(context, image, left, top) {
      let iWidth  = image.width
      let iHeight = image.height
      let source = {
        top: 0
      , left: 0
      , height: iHeight
      , width: iWidth
      }

      let target = {
        top:    top  + this.borders.top
      , left:   left + this.borders.left
      , height: this.height - this.borders.top - this.borders.bottom
      , width:  this.width - this.borders.left - this.borders.right
      }

      if (this.crop) {
        source = this._fitToRect(source, target, "crop")
      } else {
        target = this._fitToRect(source, target, false)
      }

      context.drawImage(
        image
      , source.left, source.top, source.width, source.height
      , target.left, target.top, target.width, target.height)
    }


    addText(context, cardData, left, top) {}


    drawStroke(context, left, top) {
      let r = this.borderRadius
      let x = left + r
      let y = top
      let quarter = Math.PI / 2
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x += this.width - 2 * r, y)
      context.arc   (x,        y += r,  r, -quarter,    0)
      context.lineTo(x += r,                  y += this.height - 2 * r)
      context.arc   (x -= r,   y,       r, 0,           quarter)
      context.lineTo(x -= this.width - 2 * r, y += r)
      context.arc   (x,       (y -= r), r, quarter,     quarter * 2)
      context.lineTo(x = left,                y = top + r)
      context.arc   (left + r, top + r, r, quarter * 2, quarter * 3)
      context.strokeStyle = this.strokeStyle
      context.stroke()
    }


    _treatCompleteCanvas(canvas, isBack) {
      if (this.createCues) {
        this.createCues = false
        this.canvasses.length = this.treated
                              = this.page
                              = this.row
                              = this.column
                              = this.ignored
                              = 0
        this.images.forEach(this.createCue.bind(this))
      }
    }


    _fitToRect(insertRect, frameRect, crop) {
      let ratio  = frameRect.width / insertRect.width
      let heightRatio = frameRect.height / insertRect.height
      let width
        , height
        , top
        , left

      if (crop) {
        if (ratio > heightRatio) {
          heightRatio /= ratio
          ratio = 1
        } else {
          ratio /= heightRatio
          heightRatio = 1
        }

        width  = insertRect.width * ratio
        height = insertRect.height * heightRatio
        left   = insertRect.left + (insertRect.width - width) / 2
        top    = insertRect.top + (insertRect.height - height) / 2

      } else {
        if (ratio > heightRatio) {
          ratio = heightRatio
        }

        width  = insertRect.width * ratio
        height = insertRect.height * ratio
        left   = frameRect.left + (frameRect.width - width) / 2
        top    = frameRect.top + (frameRect.height - height) / 2
      }
      return {
        top: top
      , left: left
      , width: width
      , height: height
      }
    }


    _getStrokeStyle() {
      let strokeStyle = "#000"

      if ( this.borders.top
        || this.borders.right
        || this.borders.bottom
        || this.borders.left
        ) {
        // There is at least one non-zero border
        let HSL = this._hexToHSL(this.borderColour)
        if (HSL[2] < 0.5) {
          strokeStyle = "#fff"
        }
      }

      return strokeStyle
    }


    _hexToHSL(hexString) {
      while (hexString[0] === "#") {
        hexString = hexString.substring(1)
      }

      if (hexString.length === 3) {
        hexString = hexString[0] + hexString[0]
                  + hexString[1] + hexString[1]
                  + hexString[2] + hexString[2]
      }

      let rgb = hexToRGB(hexString)

      let r  = rgb.r / 255
      let g  = rgb.g / 255
      let b  = rgb.b / 255

      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if(max === min){
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return [h, s, l];

      function hexToRGB(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
                ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
                }
                : { r: 0, g: 0, b: 0 };
      }
    }


    _randomColour() {
      let randomColour = "#"

      for ( let ii = 0; ii < 3; ii += 1 ) {
        let hex = (Math.floor(Math.random() * 255)).toString(16)
        if (hex.length === 1) {
          hex = "0" + hex
        }

        randomColour += hex
      }

      return randomColour
    }

  }

})(window)