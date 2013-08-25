Rectangle = require "../math/rectangle.coffee"

class BitmapFont
  constructor: (@fontFile, @textureRegion) ->
    @chars = {}
    @parseFontFile()

  ###
   * Parses the font file and stores the character information
   * in the chars instance variable
  ###
  parseFontFile: ->
    for line in @fontFile.split "\n"
      split = line.split " "
      if split[0] is "char"
        char = {}
        for parameter in split.slice 1, -1
          [key, val] = parameter.split "="

          char[key] = parseInt val

        @chars[char.id] = char

  getBounds: (text) ->
    width = 0
    height = 0
    for i in [0...text.length]
      character = text.substr(i, 1)

      charCode = character.charCodeAt 0
      continue unless @chars[charCode]?

      char = @chars[charCode]
      width += char.xadvance
      height = char.height

    return new Rectangle(0, 0, width, height)

  ###
   * Draws the text on the given canvas
   * @param  {CanvasRenderingContext2D} context
   * @param  {String} text
   * @param  {Number} x
   * @param  {Number} y
  ###
  drawText: (context, text, x, y) ->
    xOffset = 0
    for i in [0...text.length]
      character = text.substr(i, 1)

      charCode = character.charCodeAt 0
      continue unless @chars[charCode]?

      char = @chars[charCode]
      @textureRegion.draw context,
        char.x, char.y,
        char.width, char.height,
        x + xOffset + char.xoffset or 0, y + char.yoffset or 0
      xOffset += char.xadvance

module.exports = BitmapFont
