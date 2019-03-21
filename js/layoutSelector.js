/** layoutSelector.js **
 *
 * - Generates a `data` object which defines how the selected images
 *   will be treated
 * - Controls the master-slave menu system in the main section.
 *
**/



;(function layoutSelectorLoaded(global){
  "use strict"



  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  jazyx.classes.LayoutSelector = class LayoutSelector {
    constructor() {
      this.data = {
      // // OUTPUT
      //   shape:        "playing-card"
      // , layout:       "flash-card"
      // // PAPER
      // , paper:        "a4"
      // , orientation: " portrait"
      // // MARGINS
      // , marginTop:    "0.13"
      // , marginRight:  "0.13"
      // , marginBottom: "0.13"
      // , marginLeft:   "0.13"
      // , units:        "inches"
      // // DIMENSIONS
      // , canvasWidth   <integer>
      // , canvasHeight  <integer>
      }

      // Master, slave menus and slave details
      this.master = document.querySelector("#master-menu select")

      let selector = "div#slave-menu > div"
      this.slaves = [].slice.call(document.querySelectorAll(selector))

      this.details = document.querySelector("div.details")

      // Other settings: select and input elements
      selector = `
        .settings select
      , #crop-image input
      , #margins input
      , #borders input
      , #borderColour input
      , #borderRadius input
      , #font-size input`
      this.settings = [].slice.call(document.querySelectorAll(selector))

      // React to change events (select and text input)
      let settings = document.querySelector(".settings")
      let listener = this.changeValue.bind(this)
      settings.addEventListener("change", listener, false)

      // Margins: also react to keyboard input
      listener = this.setMargins.bind(this)
      margins.addEventListener("keydown", listener, false)
      margins.addEventListener("keyup", listener, false)

      this.changeValue()
      this.changeValue({ target: this.master })

      console.log(this.data)
    }


    changeValue(input) {
      if (!input) {
        // The call came from constructor(). Use default values.
        this.settings.forEach( setting => {
          this.changeValue(setting)
        })

        return
      }

      input = this._getInputElement(input.target || input)

      // Special treatment for master menu
      if (input === this.master) {
        return this._masterSelection()
      }

      // Standard treatment for all other inputs
      let value = this._getValue(input)
      let name = input.getAttribute("name")

      this.data[name] = value

      this._showDetailsIfNeeded(input)
      this._setCanvasDimensions()
    }


    setMargins(event) {
      switch (event.type) {
        case "keydown":
          if ( /[^0-9.]/.test(event.key)
            && [8, 9, 37, 38, 39, 40, 46, ].indexOf(event.keyCode) < 0
             ) {
            event.preventDefault()
            return false
          }
        break
        case "keyup":
          this.changeValue(event.target)
      }
    }


    _masterSelection() {
      let master = this._getValue(this.master)
      let slaveId = 0 + (master.indexOf("dobble") < 0)
      slaveId = ["dobble", "standard"][slaveId]

      this.slaves.forEach( slave => {
        if (slave.id === slaveId) {
          slave.classList.add("active")
          this.changeValue(slave.querySelector("select"))
        } else {
          slave.classList.remove("active")
        }
      })

      this.data.shape = master
    }


    _getValue(element) {
      let value

      if (element.options) {
        value = element.options[element.selectedIndex].value
      } else if (element.getAttribute("type") === "checkbox"){
        value = element.checked
      } else {
        value = element.value
      }

      return value
    }


    _getInputElement(input) {
      let tagNames = ["INPUT", "SELECT"]
      while ( input
           && tagNames.indexOf(input.tagName.toUpperCase()) < 0
            ) {
        input = input.parentNode
      }

      return input
    }


    _showDetailsIfNeeded(element) {
      let showDetails = false

      if (element.options) {
        let option = element.options[element.selectedIndex]
        showDetails = option.classList.contains("details")
      }

      if (showDetails) {
        this.details.classList.add("active")
      } else {
        this.details.classList.remove("active")
      }
    }


    _setCanvasDimensions() {
      // /// <<< HARD-CODED
      let dpi       = 300
      let iToMm     = 25.4
      // /// HARD-CODED >>>

      let dpmm    = 300 / iToMm
      let adjust  = this.data.units === "inches"
                  ? iToMm * dpmm
                  : dpmm

      // MARGINS and BORDERS
      let marginH = (parseFloat(this.data.marginTop)
                  +  parseFloat(this.data.marginBottom)) * adjust
      let marginW = (parseFloat(this.data.marginLeft)
                  +  parseFloat(this.data.marginRight)) * adjust

      this.data.borders = {
        top:    this.data.borderTop    * adjust
      , right:  this.data.borderRight  * adjust
      , bottom: this.data.borderBottom * adjust
      , left:   this.data.borderLeft   * adjust
      }

      // Use A4 portrait by default
      let paperWidth   = 210
      let paperHeight  = 297
      if (this.data.paper === "letter") {
        paperWidth   = 215.9
        paperHeight  = 279.4
      }
      if (this.data.orientation === "landscape") {
        paperWidth = paperHeight + (paperHeight = paperWidth, 0)
      }

      this.data.canvasWidth = Math.floor(paperWidth * dpmm - marginW)
      this.data.canvasHeight= Math.floor(paperHeight * dpmm - marginH)
    }
  }



})(window)