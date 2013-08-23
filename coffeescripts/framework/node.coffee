Vector2   = require "./math/vector2.coffee"
Rectangle = require "./math/rectangle.coffee"

class Node
  constructor: (@game) ->
    @position = new Vector2()
    @scale    = new Vector2(1, 1)
    @rect     = new Rectangle()

  ###
    Position
  ###
  getPosition: -> @position
  setPosition: (x, y) -> @position.set x, y

  getX: -> @position.getX()
  setX: (x) -> @position.setX x

  getY: -> @position.getY()
  setY: (y) -> @position.setY y

  ###
    Scale
  ###
  getScale: -> @scale
  setScale: (x, y) -> @scale.set x, y

  getScaleX: -> @scale.getX()
  setScaleX: (x) -> @scale.setX x

  getScaleY: -> @scale.getY()
  setScaleY: (y) -> @scale.setY y

  ###
    Size
  ###
  getSize: -> @rect.getSize()
  setSize: (width, height) -> @rect.setSize width, height

  getWidth: -> @rect.getWidth()
  getHeight: -> @rect.getHeight()


module.exports = Node
