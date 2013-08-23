Vector2 = require "./vector2.coffee"

class Rectangle
  constructor: (x = 0, y = 0, @width = 0, @height = 0) ->
    @position = new Vector2(x, y)

  ###
   * Sets the position
  ###
  setPosition: -> @position.set.call this, arguments

  ###
   * Sets the size values
   * @param [Number] width
   * @param [Number] height
  ###
  setSize: (width, height) ->
    @width = width
    @height = height

  getWidth: -> @width
  getHeight: -> @height

module.exports = Rectangle
