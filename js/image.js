/** image.js **
 *
 *
**/



;(function imageLoaded(global){
  "use strict"


  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  jazyx.classes.Image = class Image {
    constructor(src, hash, title, container) {
      this.src = src
      this.title = title
      this._createDivAndCheckbox(src, hash, title, container)
      // this.div
      // this.checkbox
      this.ignore = false

      let listener = this.mouseUp.bind(this)
      this.div.addEventListener("mouseup", listener, false)
    }


    mouseUp(event) {
      switch (event.target.tagName) {
        case "LABEL":
          this.ignore = this.checkbox.checked
        break
        case "IMG":
          // TODO: show image in editor
        break
        case "SPAN":

        break
      }
    }


    _createDivAndCheckbox(src, hash, title, container) {
      this.div = document.createElement("div")

      this.div.innerHTML = `
        <input type="checkbox" id="${hash}" checked></input>
        <img src="${src}" />
        <span>${title}</span>
        <label for="${hash}"></label>
      `
      container.appendChild(this.div)
      this.checkbox = this.div.querySelector("input")
    }
  }


})(window)