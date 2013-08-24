class Vector2
  constructor: (@x = 0, @y = 0) -> return

  ###
   * Sets the new position of the Vector2
   * @param [Number] x
   * @param [Number] y
  ###
  set: (x, y) ->
    if x instanceof Vector2
      otherV2 = x

      @x = otherV2.x
      @y = otherV2.y
    else
      @x = x
      @y = y

    return this

  ###
   * Returns a clone of this Vector
   * @return {Vector2}
  ###
  clone: -> new Vector2(@x, @y)

  ###
   * Rounds the values of this Vector
  ###
  round: ->
    @x = Math.round @x
    @y = Math.round @y

    return this

  ###
   * Substracts the given values from this Vector
   * @param [Number] x
   * @param [Number] y
  ###
  substract: (x, y) ->
    if x instanceof Vector2
      v2 = x
      x = v2.getX()
      y = v2.getY()
    else if x? and not y?
      y = x

    @x = @x - x
    @y = @y - y

    return this

  ###
   * Adds the given values to this Vector
   * @param [Number] x
   * @param [Number] y
  ###
  add: (x, y) ->
    if x instanceof Vector2
      v2 = x
      x = v2.getX()
      y = v2.getY()
    else if x? and not y?
      y = x

    @x = @x + x
    @y = @y + y

    return this

  ###
   * Divides this Vector by the given values
   * @param [Number] x
   * @param [Number] y
  ###
  divideBy: (x, y) ->
    if x instanceof Vector2
      v2 = x
      x = v2.getX()
      y = v2.getY()
    else if x? and not y?
      y = x

    @x = @x / x
    @y = @y / y

    return this

  ###
   * Multiplies this Vector with the given values
   * @param [Number] x
   * @param [Number] y
  ###
  multiply: (x, y) ->
    if x instanceof Vector2
      v2 = x
      x = v2.getX()
      y = v2.getY()
    else if x? and not y?
      y = x

    @x = @x * x
    @y = @y * y

    return this

  ###
   * Returns the x value
   * @return [Number]
  ###
  getX: -> @x

  ###
   * Returns the y value
   * @return [Number]
  ###
  getY: -> @y

  ###
   * Sets the x value
   * @param [Number] x
  ###
  setX: (x) -> @x = x

  ###
   * Sets the y value
   * @param [Number] y
  ###
  setY: (y) -> @y = y

module.exports = Vector2
