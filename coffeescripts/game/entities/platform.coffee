Config = require "../config/config.json"

class Platform
  constructor: (@app, @game, @options={}) ->
    @position = @options.position || new LDFW.Vector2(2, 4)
    @width    = @options.width || 3
    @height   = @options.height || 10

    @stylesMap = []
    for y in [0...@height]
      @stylesMap[y] = []
      for x in [0...@width]
        @stylesMap[y].push Math.floor(Math.random() * Config.sprites_per_block_style)

  getPosition: ->
    @position
  getWidth: -> @width
  getHeight: -> @height
  getStylesMap: -> @stylesMap

module.exports = Platform
