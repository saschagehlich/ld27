Config = require "../config/config.json"

class Block
  availableBlocks: require "../config/available_blocks.json"
  constructor: (@app, @game, @options={}) ->
    @buildMode = @options.buildMode || false

    # Represents the block's structure
    @map = null
    @rotation = Math.round(Math.random() * 3)

    @gridPosition = new LDFW.Vector2()

    @randomize()
    @defaultStyle = Math.floor(Math.random() * Config.block_styles)
    @style = @defaultStyle
    @randomizeBlockStyles()

  setStyle: (@style) -> return
  setDefaultStyle: -> @style = @defaultStyle

  randomizeBlockStyles: ->
    @blockStyles = []
    for row in @map
      r = []
      for col in row
        r.push Math.floor(Math.random() * Config.sprites_per_block_style)

      @blockStyles.push r

  randomize: ->
    index = Math.floor(Math.random() * @availableBlocks.length)
    @map = @availableBlocks[index]

  getGridPosition: -> @gridPosition
  setGridPosition: -> @gridPosition.set.apply @gridPosition, arguments

  rotate: ->
    @rotation += 1
    @rotation %= 4

  getMap: ->
    map = @map
    for i in [0...@rotation]
      newData = []
      for i in [map.length-1..0]
        for j in [0...map[i].length]
          unless newData.hasOwnProperty(j)
            newData[j] = []
          newData[j].push map[i][j]
      map = newData

    return map

  getBlockStyles: ->
    styles = @blockStyles

    for i in [0...@rotation]
      newData = []
      for i in [styles.length-1..0]
        for j in [0...styles[i].length]
          unless newData.hasOwnProperty(j)
            newData[j] = []
          newData[j].push styles[i][j]
      styles = newData

    return styles


  getRotation: -> @rotation

  inBuildMode: -> @buildMode
  setBuildMode: (buildMode) -> @buildMode = buildMode

  getStyle: -> @style

module.exports = Block
