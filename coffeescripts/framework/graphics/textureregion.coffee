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
    context.drawImage(
      @image,
      @frame.frame.x + sx, @frame.frame.y + sy,
      Math.min(sw, (@frame.spriteSourceSize.w + @frame.frame.x) - sx),
      Math.min(sh, (@frame.spriteSourceSize.h + @frame.frame.y) - sy),
      dx, dy,
      Math.min(sw, (@frame.spriteSourceSize.w + @frame.frame.x) - sx),
      Math.min(sh, (@frame.spriteSourceSize.h + @frame.frame.y) - sy),
    )

module.exports = TextureRegion
