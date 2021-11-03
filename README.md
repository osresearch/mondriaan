![Rear-projected on glass doros](images/demo.jpg)

## Mondrian Garage Door projection mapping

See it in action: https://osresearch.github.io/mondriaan/

* Hit `f` to toggle full screen mode.
* Hit `b` to toggle between bright and dark mode.
* Click the four corners to align it to your wall.
* Hover the mouse and hit space to log the UV space coordinates

![Behind the scenes](images/alignment.jpg)

The sizes and locations of the bars are specific to the installation.
You can move them around by changing the `dividers` array to set
change where they are.


## Perspective Transformation and Alignment

The projection mapping is done with [p5.projection.js](https://github.com/osresearch/p5.projection),
a library for converting XY canvas coordinates into UV real world coordinates.
