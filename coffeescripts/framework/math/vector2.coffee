class Vector2
  constructor: (@x = 0, @y = 0) -> return

  ###
   * Sets the new position of the Vector2
   * @param {Number} x
   * @param {Number} y
  ###
  set: (x, y) ->
    if x instanceof Vector2
      otherV2 = x

      @x = otherV2.x
      @y = otherV2.y
    else
      @x = x
      @y = y

  ###
   * Returns the x value
   * @return {Number}
  ###
  getX: -> @x

  ###
   * Returns the y value
   * @return {Number}
  ###
  getY: -> @y

  ###
   * Sets the x value
   * @param {Number} x
  ###
  setX: (x) -> @x = x

  ###
   * Sets the y value
   * @param {Number} y
  ###
  setY: (y) -> @y = y

module.exports = Vector2
