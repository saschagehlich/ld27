Vector2 = require "../math/vector2.coffee"
Node    = require "../node.coffee"

class Sprite extends Node
  ###
   * A Sprite represents a drawable image
   * @param  {TextureAtlas} @TextureAtlas
  ###
  constructor: (@textureAtlas, @frame) ->
    super

    @position = new Vector2()
    @scale = new Vector2(1, 1)

  getWidth: -> @frame.frame.w * @scale.x
  getHeight: -> @frame.frame.h * @scale.y

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

module.exports = Sprite
