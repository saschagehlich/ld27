Vector2 = require "../math/vector2.coffee"
Node    = require "../node.coffee"

class Sprite extends Node
  ###
   * A Sprite represents a drawable image
   * @param  [TextureAtlas] @TextureAtlas
  ###
  constructor: (@textureAtlas, @frame) ->
    super

    @rotation = 0

  getWidth: -> @frame.frame.w * @scale.x
  getHeight: -> @frame.frame.h * @scale.y

  getRotation: -> @rotation
  setRotation: (rotation) -> @rotation = rotation

  ###
   * Draws the sprite on the given context
   * @param  [CanvasRenderingContext2D] context
  ###
  draw: (context) ->
    image = @textureAtlas.getAtlasImage()

    # Source rectangle
    sx = @frame.frame.x
    sy = @frame.frame.y
    sw = @frame.frame.w
    sh = @frame.frame.h

    # Destination rectangle
    dw = @frame.frame.w * @scale.x
    dh = @frame.frame.h * @scale.y

    context.save()

    context.translate @position.x + @origin.x, @position.y + @origin.y
    context.rotate Math.PI / 180 * @rotation

    context.drawImage image, sx, sy, sw, sh, -@origin.x, -@origin.y, dw, dh

    context.restore()

module.exports = Sprite
