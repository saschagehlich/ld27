Vector2 = require "../math/vector2.coffee"

class Sprite
  ###
   * A Sprite represents a drawable image
   * @param  {TextureAtlas} @TextureAtlas
  ###
  constructor: (@textureAtlas, @frame) ->
    @position = new Vector2()
    @scale = new Vector2(1, 1)
    return

  ###
   * Draws the sprite on the given context
   * @param  {CanvasRenderingContext2D} context
  ###
  draw: (context) ->
    image = @textureAtlas.getAtlasImage()
    sx = @frame.frame.x
    sy = @frame.frame.y
    sw = @frame.frame.w
    sh = @frame.frame.h

    dx = @position.x
    dy = @position.y
    dw = @frame.frame.w * @scale.x
    dh = @frame.frame.h * @scale.y

    context.drawImage image, sx, sy, sw, sh, dx, dy, dw, dh

  ###
   * Getters and setters
  ###
  getPosition: -> @position
  setPosition: (x, y) -> @position.set x, y
  setScaleX: (scale) -> @scale.setX scale
  setScaleY: (scale) -> @scale.setY scale
  setScale: (scaleX, scaleY) -> @scale.set scaleX, scaleY

module.exports = Sprite
