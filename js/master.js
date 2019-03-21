/** master.js **
 *
 * Co-ordinates the work of the LayoutSelector, ImageReader and
 * CardGenerator objects.
**/



;(function masterLoaded(global){
  "use strict"


  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  jazyx.classes.Master = class Master {
    constructor(classes) {
      this.generator = new classes.CardGenerator(
        classes.templates
      , document.querySelector("#master-menu select")
      )
      this.layout    = new classes.LayoutSelector()
      this.reader    = new classes.ImageReader(classes.Image)

      let generateButton = document.querySelector("button")
      let listener = this.generateCards.bind(this)
      generateButton.addEventListener("mouseup", listener, false)
    }


    generateCards() {
      this.generator.generate(this.layout.data, this.reader.images)
    }
  }


  jazyx.master = new jazyx.classes.Master(jazyx.classes)

})(window)