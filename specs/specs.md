# Flash cards

## Input
User can choose both which images to use, and how those images will be laid out as cards in the output. The output will always be a set of images that fit the printable area of an A4 or US Letter page, where the input images (and associated text) will be arranged according to a pre-defined pattern, such as *Playing card* or *Hexagonal Dobble*.

The choice of layout uses a master-slave menu system. One JS object is required to update the menu presentation, and to remember the slave settings for each choice of master. A second JS object will deal with the choice of images: *predefined set*, *uploaded* or *from online URL*. A third JS object will use the layout and image inputs to generate the output images.

## TO DO

1. Allow user to edit image names
2. Show one-page preview
3. Show card front and back preview
4. Highlight cards with
    * longest text
    * widest image
    * tallest image
5. Save image collections
0. Save settings with custom names
6. Allow user to add URLs to collection
7. Add extension to allow single click from images.google.tdl
8. Import and implement details
9. Allow user to edit all margins or borders at once
9. Set units to `mm` or `inches` in one place
9. For each imported image, allow user to:
    * exclude the image
    * make a custom crop
    * change orientation
    * select a custom border colour
    * modify text (header, body, list)
0. Delete each canvas separately
1. Choose Google web font

## IN PROGRESS
9. Create classes for each output type
