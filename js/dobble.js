/** dobble.js **
 *
 *
**/



;(function dobbleLoaded(global){
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



  templates.Dobble = class Dobble extends templates.Card {
    constructor() {
      super()
      this.display = "Hexagonal Dobble (31 images)"
      this.value = "Hex-dobble"
    }


    generate(layout, images) {
      super.generate(layout, images)
    }

    getCardSize(layout) {
      // { shape:        "Dobble"
      // , layout:       <"initial", "name", "randomized">
      // , canvasWidth:  <integer>
      // , canvasHeight: <integer>
      // }
    }
  }

})(window)