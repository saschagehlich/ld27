Vector2 = require "../math/vector2.coffee"

class TextureRegion
  constructor: (@atlas, @frame) ->
    @image = @atlas.getAtlasImage()

  ###
   * Draws the given rectangle of the region to the given location
   * @param  {CanvasRenderingContext2d} context
   * @param  {Number} sx
   * @param  {Number} sy
   * @param  {Number} sw
   * @param  {Number} sh
   * @param  {Number} dx
   * @param  {Number} dy
  ###
  draw: (context, sx, sy, sw, sh, dx, dy) ->
    finalsx = @frame.frame.x + sx
    finalsy = @frame.frame.y + sy
    sw = Math.min(sw, (@frame.spriteSourceSize.w + @frame.frame.x) - (@frame.frame.x + sx))
    sh = Math.min(sh, (@frame.spriteSourceSize.h + @frame.frame.y) - (@frame.frame.y + sy))
    dw = sw
    dh = sh

    return if sw is 0 or sh is 0
    context.drawImage(
      @image,
      finalsx, finalsy,
      sw, sh,
      dx, dy,
      dw, dh
    )

module.exports = TextureRegion
