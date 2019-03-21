/** imageReader.js **
 *
 * Allows the user to select images in a folder, in order to create
 * a set of A4-sized images for printing.
**/



;(function imageReaderLoaded(global){
  "use strict"



  let jazyx = global.jazyx

  if (!jazyx) {
    jazyx = global.jazyx = {}
  }

  if (!(jazyx.classes)) {
    jazyx.classes = {}
  }



  jazyx.classes.ImageReader = class ImageReader {
    constructor(ImageClass) {
      this.ImageClass = ImageClass
      this.images = []
      this.hashes = []
      this.data = {
        images: this.images
      }

      // Check HTML5 File API Browser Support
      if (window.File && window.FileList && window.FileReader) {
        this.thumbnails = document.getElementById("thumbnails");
        this.imageInput = document.getElementById("images");

        let listener = this.showFile.bind(this)
        this.imageInput.addEventListener("change", listener, false)

      } else {
        alert("Your browser is too old to support HTML5 File API");
      }
    }


    showFile(event) {
      let input = event.target
      let files = input.files
      let length = files.length

      for (let ii = 0; ii < length; ii++) {
        let reader = new FileReader();
        let file = files[ii]
        let name = this._getImageName(file)

        reader.onload = (readerEvent) => {
          let src = readerEvent.target.result
          let hash = this._hashCode(src)

          // Ensure all images are unique
          if (this.hashes.indexOf(hash) < 0) {
            let image = new this.ImageClass(
              src
            , hash
            , name
            , this.thumbnails
            )

            this.images.push(image)
            this.hashes.push(hash)
          }
        }

        reader.readAsDataURL(file);
      }
    }


    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    _hashCode(string) {
      var hash = 0, i, chr;
      if (string.length === 0) return hash;
      for (i = 0; i < string.length; i++) {
        chr   = string.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }


    _getImageName(file) {
      let name = file.name

      name = name.replace(/_/g, " ")
      name = name.replace(/\.(jpg|jpeg|png|gif|webp)$/i, "")

      return name
    }
  }


})(window)