/** cardGenerator.js **
 *
 * Takes the images defined by the ImageReader object and the layout
 * defined by the LayoutSelector object and produces the output
 * images, to fit the printable area of an A4 or US Letter page.
**/



;(function cardGeneratorLoaded(global){
  "use strict"


  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  jazyx.classes.CardGenerator = class CardGenerator {
    constructor(templates, selectElement) {
      this.templates = templates
      this._addOptionsTo(selectElement)
    }


    generate(layout, images) {
      let shape = layout.shape
      this.generator = new this.templates[shape]()
      this.generator.generate(layout,images)
    }


    _addOptionsTo(selectElement) {
      let templateNames = Object.keys(this.templates)

      templateNames.forEach( className => {
        if (className === "Card") {
          return
        }

        let template = this.templates[className]
        let displayData = new template().getDisplayData()
        // { display: this.display , value: this.value }
        let option = document.createElement("option")
        option.setAttribute("value", displayData.value)
        option.innerText = displayData.display
        selectElement.appendChild(option)
      })
    }

  }

})(window)



/** dobble.js **
 *
 *
**/



// ;(function dobbleLoaded(global){
//   "use strict"


//   let jazyx = global.jazyx

//   if (!jazyx) {
//     jazyx = global.jazyx = {}
//   }

//   if (!(jazyx.classes)) {
//     jazyx.classes = {}
//   }



//   jazyx.classes.Dobble = class Dobble {
//     constructor(map, edgeColour) {
//       this.map = map
//       this.edgeColour = edgeColour

//       this.imageAngle = Math.PI / 6

//       this.images = this.map.images // Object.keys(this.map.cards)
//       this.imageFolder = this.map.imageFolder

//       this.cards = [
//           [ [0,  1,  2,  3,  4,  5]
//           , [0,  6,  7,  8,  9, 10]
//           , [0, 11, 12, 13, 14, 15]
//           , [0, 16, 17, 18, 19, 20]
//           , [0, 21, 22, 23, 24, 25]
//           ]
//         , [ [0, 26, 27, 28, 29, 30]
//           , [1,  6, 11, 16, 21, 26]
//           , [1,  7, 12, 17, 22, 27]
//           , [1,  8, 13, 18, 23, 28]
//           , [1, 9, 14, 19, 24, 29]
//           ]
//         , [ [1, 10, 15, 20, 25, 30]
//           , [2,  6, 12, 18, 24, 30]
//           , [2,  7, 13, 19, 25, 26]
//           , [2,  8, 14, 20, 21, 27]
//           , [2, 9, 15, 16, 22, 28]
//           ]
//         , [ [2, 10, 11, 17, 23, 29]
//           , [3,  6, 13, 20, 22, 29]
//           , [3,  7, 14, 16, 23, 30]
//           , [3,  8, 15, 17, 24, 26]
//           , [3, 9, 11, 18, 25, 27]
//           ]
//         , [ [3, 10, 12, 19, 21, 28]
//           , [4,  6, 14, 17, 25, 28]
//           , [4,  7, 15, 18, 21, 29]
//           , [4,  8, 11, 19, 22, 30]
//           , [4, 9, 12, 20, 23, 26]
//           ]
//         , [ [4, 10, 13, 16, 24, 27]
//           , [5,  6, 15, 19, 23, 27]
//           , [5,  7, 11, 20, 24, 28]
//           , [5,  8, 12, 16, 25, 29]
//           , [5, 9, 13, 17, 21, 30]
//           ]
//       ]

//       this.initialize()

//       this.drawCards()
//     }


//     initialize() {
//       /// <<< HARD-CODED
//       let font = "Kalam"
//       let fontRatio = 0.2
//       let initialOffset = 0.36
//       let centreSize = 0.2
//       let imageOffset = 0.667
//       let imageSize = 0.8
//       this.scale = 0.985
//       /// HARD-CODED >>>

//       let dpi       = 300
//       let iToMm     = 25.4
//       let dpmm      = 300 / iToMm
//       let margin    = 5 // mm
//       let A4width   = 210
//       let A4height  = 297

//       let hexHeight = 4 // 4 x half base of equilateral triangle
//       let rootThree = Math.sqrt(3)
//       let hexWidth  = rootThree

//       // Hexagons will be arranged 5 to a page:
//       // • •
//       //  •
//       // • •
//       // height = 10 x half the base of an equilateral triangle
//       // width  = 4 x the height of a triangle, or 2 x the hexagon

//       let height = (A4height - 2 * margin) * dpmm
//       let side   = this.side = height / (hexHeight * 2.5)

//       this.canvasHeight = 10 * side + 2
//       this.canvasWidth  = hexWidth * 4 * side + 4

//       this.equiHeight = side * rootThree
//       // this.d = centreSize

//       this.nameSize = Math.round(side * fontRatio)
//       // this.initialSize = Math.round(side * initialRatio)
//       this.initialOffset = Math.round(side * (centreSize + initialOffset))
//       this.imageOffset = Math.round(side * imageOffset)
//       this.imageSize = Math.round(side * imageSize)

//       this.fontStyle = "#000"
//       this.nameFont = this.nameSize + "px " + font
//     }


//     drawCards() {
//       let topLefts = [
//         {top: 1,                 left: 1}
//       , {top: 1,                 left: 1 + this.equiHeight * 2}
//       , {top: 1 + this.side * 3, left: 1 + this.equiHeight}
//       , {top: 1 + this.side * 6, left: 1}
//       , {top: 1 + this.side * 6, left: 1 + this.equiHeight * 2}
//       ]

//       this.cards.forEach((batch) => {
//         let canvas = document.createElement("canvas")
//         let context = canvas.getContext("2d")
//         canvas.width = this.canvasWidth
//         canvas.height = this.canvasHeight
//         document.body.appendChild(canvas)

//         batch.forEach((cardData, index) => {
//           let topLeft = topLefts[index % 5]
//           this.drawCard(context, cardData, topLeft)
//         })
//       })
//     }


//     drawCard(context, cardData, topLeft) {
//       this.drawHex(context, topLeft.left, topLeft.top)

//       let centre = {
//         left: topLeft.left + (this.equiHeight)
//       , top:  topLeft.top  + (this.side * 2)
//       }

//       let imageFolder = this.map.imageFolder

//       let images = cardData.map(imageIndex => {
//         return this.images[imageIndex]
//       })

//       // this.shuffle(images)

//       images.forEach((relativePath, index) => {
//         let imageSrc = this.imageFolder
//                      + relativePath
//         let name = /([^\/]+)\.(?:png|jpg|gif|svg)$/.exec(relativePath)
//         if (!name) {
//           return
//         }

//         let image = new Image()
//         // initial = initial.toUpperCase()
//         name = name[1].replace(/_/g, " ").toLowerCase()

//         let imageLoaded = (event) => {
//           // console.log(event.target.src)

//           context.save()
//           context.translate(centre.left, centre.top)
//           context.rotate(this.imageAngle * (2 * index - 1))

//           this.drawImage(context, image, centre)
//           this.drawName(context, name, centre)

//           context.restore()
//         }

//         image.onload = imageLoaded
//         image.src = imageSrc
//       })
//     }


//     drawHex(context, left, top) {
//       let a = this.equiHeight
//       let h = this.side
//       let fillHex = (fillStyle) => {
//         context.beginPath()
//         context.moveTo(left + a,     top)
//         context.lineTo(left + 2 * a, top + h)
//         context.lineTo(left + 2 * a, top + 3 * h)
//         context.lineTo(left + a,     top + 4 * h)
//         context.lineTo(left,         top + 3 * h)
//         context.lineTo(left,         top + h)
//         context.lineTo(left + a,     top)

//         context.fillStyle = fillStyle
//         context.fill()
//       }

//       // Fill hex entirely with the edge colour
//       fillHex(this.edgeColour)
//       context.stroke()

//       // Fill everything but the edge with white
//       left += (1 - this.scale) * a
//       top += (1 - this.scale) * 2 * h
//       a *= this.scale
//       h *= this.scale

//       fillHex("#fff")
//     }


//     drawImage(context, image, centre) {
//       let iWidth = image.width
//       let iHeight = image.height
//       let imageRect = {
//         top: 0
//       , left: 0
//       , height: iHeight
//       , width: iWidth
//       }

//       let cardSpace = {
//         top:    this.imageOffset
//       , left:  -this.imageSize / 2
//       , height: this.imageSize
//       , width:  this.imageSize
//       }

//       let target = this.fitToRect(imageRect, cardSpace)

//       context.drawImage(
//         image
//       , 0, 0, iWidth, iHeight
//       , target.left, target.top, target.width, target.height
//       )
//     }


//     fitToRect(insertRect, frameRect) {
//       let ratio = frameRect.width / insertRect.width
//       let temp  = frameRect.height / insertRect.height

//       if (ratio > temp) {
//         ratio = temp
//       }

//       let width  = insertRect.width * ratio
//       let height = insertRect.height * ratio
//       let left   = frameRect.left + (frameRect.width - width) / 2
//       let top    = frameRect.top + (frameRect.height - height) / 2

//       return {
//         top: top
//       , left: left
//       , width: width
//       , height: height
//       }
//     }


//     drawName(context, name, centre) {
//       context.font = this.nameFont

//       let width = context.measureText(name).width
//       let top = (this.equiHeight) - this.nameSize / 2
//       let left = - width / 2

//       context.fillStyle = this.fontStyle
//       context.fillText(name, left, top)
//     }


//     shuffle(a) {
//       var j, x, i;
//       for (i = a.length - 1; i > 0; i--) {
//         j = Math.floor(Math.random() * (i + 1));
//         x = a[i];
//         a[i] = a[j];
//         a[j] = x;
//       }
//       return a;
//     }
//   }



//   window.setTimeout(() => {
//     // HACK TO ENSURE THAT Kalam FONT IS DOWNLOADED FIRST
//     jazyx.dobble = new jazyx.classes.Dobble(jazyx.map, "#ccf")
//   }, 200)

// })(window)