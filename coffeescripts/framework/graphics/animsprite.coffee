Vector2 = require "../math/vector2.coffee"
Sprite  = require "./sprite.coffee"

class AnimSprite extends Sprite
  constructor: (@textureAtlas, @frame, @spriteCount, @animationInterval) ->
    super

    @rotation = 0
    @sumDelta = 0
    @spriteIndex = 0

  getWidth: -> @frame.frame.w * @scale.x
  getHeight: -> @frame.frame.h * @scale.y

  getRotation: -> @rotation
  setRotation: (rotation) -> @rotation = rotation

  update: (delta) ->
    if @sumDelta >= @animationInterval
      @spriteIndex++
      if @spriteIndex > @spriteCount - 1
        @spriteIndex = 0

      @sumDelta -= @animationInterval
    @sumDelta += delta

  ###
   * Draws the sprite on the given context
   * @param  [CanvasRenderingContext2D] context
  ###
  draw: (context, drawX, drawY, mirrored=false) ->
    image = @textureAtlas.getAtlasImage()

    widthPerSprite = Math.floor(@frame.frame.w / @spriteCount)

    # Source rectangle
    sx = @frame.frame.x
    sy = @frame.frame.y
    sw = widthPerSprite
    sh = @frame.frame.h

    sx += widthPerSprite * @spriteIndex

    # Destination rectangle
    dw = widthPerSprite * @scale.x
    dh = @frame.frame.h * @scale.y

    context.save()

    tx = (drawX | @position.x) + @origin.x + Sprite.renderOffset.x
    ty = (drawY | @position.y) + @origin.y + Sprite.renderOffset.y

    if mirrored
      context.translate tx + dw, ty
      context.scale -1, 1
    else
      context.translate tx, ty

    context.rotate Math.PI / 180 * @rotation

    context.drawImage image, sx, sy, sw, sh, -@origin.x, -@origin.y, dw, dh

    context.restore()

module.exports = AnimSprite
