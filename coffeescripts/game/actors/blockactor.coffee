Config = require "../config/config.json"
Segment = require "../entities/segment.coffee"

class BlockActor extends LDFW.Actor
  availableBlocks: require "../config/available_blocks.json"
  constructor: (@app, @game, @level, @options={}) ->
    @buildMode = @options.buildMode || false

    @spritesAtlas = @app.getSpritesAtlas()

    # Represents the block's structure
    @map = null
    @rotation = Math.round(Math.random() * 3)

    @gridPosition = new LDFW.Vector2()

    @defaultStyle = Math.floor(Math.random() * Config.block_styles)
    @style = @options.style || @defaultStyle

    @randomize()
    @randomizeBlockStyles()

    @loadSprites()

  loadSprites: ->
    @blockSprites = {}

    styles = [0...Config.block_styles]
    styles.push "broken"

    for style in styles
      @blockSprites[style] ?= {}
      for spriteIndex in [0...Config.sprites_per_block_style]
        sprite = @spritesAtlas.createSprite "blocks/#{style}-#{spriteIndex}.png"

        @blockSprites[style][spriteIndex] = sprite

      @blockSprites[style]["unbuildable"] = @spritesAtlas.createSprite "blocks/#{style}-unbuildable.png"

    @grassSprites = {}
    for spriteIndex in [0...Config.sprites_per_block_style]
      sprite = @spritesAtlas.createSprite "grass/grass-#{spriteIndex}.png"

      @grassSprites[spriteIndex] = sprite

    @grassSprites["start"] = @spritesAtlas.createSprite "grass/grass-start.png"
    @grassSprites["end"] = @spritesAtlas.createSprite "grass/grass-end.png"
    @grassSprites["single"] = @spritesAtlas.createSprite "grass/grass-single.png"

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
    map = []
    originalMap = @availableBlocks[index]
    for row, y in originalMap
      r = []
      for segment, x in row
        if segment is 0
          r.push 0
        else
          r.push new Segment this, @level
      map.push r

    @map = map

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

  steppedOn: (x, width) ->
    return unless @getStyle() is "broken"

    segmentOffset = Math.floor(x / @level.GRID_SIZE)
    segmentEnd = Math.ceil((segmentOffset + width) / @level.GRID_SIZE)

    map = @getMap()
    for i in [segmentOffset, segmentEnd]
      for row, y in map
        continue unless map[y][i]?

        map[y][i].setFalling true

  update: (delta) ->
    for row, y in @map
      for segment, x in row when segment isnt 0
        segment.update delta

  draw: (context) ->
    scroll   = @level.getScroll()

    context.save()
    position = @gridPosition
      .clone()
      .multiply(@level.GRID_SIZE)
      .substract(scroll)

    map = @getMap()
    blockStyles = @getBlockStyles()
    for row, y in map
      for segment, x in row
        continue if segment is 0

        spriteIndex = blockStyles[y][x]
        sprite = @blockSprites[@style][spriteIndex]

        if not @level.isBuildBlockBuildable() and @buildMode
          sprite = @blockSprites[@style].unbuildable
        if @buildMode
          context.globalAlpha = 0.5

        sprite.draw context,
          position.x + x * @level.GRID_SIZE,
          position.y + y * @level.GRID_SIZE + segment.getOffset().getY()

        drawGrass = true
        unless y is 0
          if map[y - 1][x] isnt 0
            drawGrass = false

        if drawGrass and @style isnt "broken"
          grassSprite = @grassSprites[spriteIndex]
          grassXOffset = 0
          if not row[x-1] and not row[x+1]
            grassSprite = @grassSprites.single
            grassXOffset = -2
          else if not row[x-1]
            grassSprite = @grassSprites.start
            grassXOffset = -2
          else if not row[x+1]
            grassSprite = @grassSprites.end

          grassSprite.draw context,
            position.x + x * @level.GRID_SIZE + grassXOffset,
            position.y + y * @level.GRID_SIZE + segment.getOffset().getY()

    context.restore()

module.exports = BlockActor
