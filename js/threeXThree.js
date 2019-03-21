/** threeXThree.js **
 *
 *
**/



;(function threeXThreedLoaded(global){
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



  templates.ThreeXThree = class ThreeXThree extends templates.Card {
    constructor() {
      super()
      this.display = "Nine to a page (3 x 3)"
      this.value = "ThreeXThree"
    }


    adjustCardDetails(layout) {
      // { shape:        "Dobble"
      // , layout:       <"initial", "name", "randomized">
      // , canvasWidth:  <integer>
      // , canvasHeight: <integer>
      // }

      let radius = Math.min(layout.canvasWidth, layout.canvasHeight)
      radius = radius * layout.borderRadius / 100

      layout.width        = Math.floor(layout.canvasWidth / 3)
      layout.height       = Math.floor(layout.canvasHeight / 3)
      layout.columns      = 3
      layout.rows         = 3
      layout.borderRadius = radius

      return layout
    }
  }

})(window)