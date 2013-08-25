Config = require "../config/config.json"
Segment = require "../entities/segment.coffee"

class BlockActor extends LDFW.Actor
  availableBlocks: require "../config/available_blocks.json"
  constructor: (@app, @game, @level, @options={}) ->
    @buildMode = @options.buildMode || false

    @spritesAtlas = @app.getSpritesAtlas()

    # Represents the block's structure
    @map = null

    @gridPosition = new LDFW.Vector2()

    @defaultStyle = Math.floor(Math.random() * Config.block_styles)
    @style = @options.style || @defaultStyle

    @randomize()
    @randomizeBlockStyles()

    for i in [0...Math.round(Math.random() * 3)]
      @rotate()

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
    newMap = []
    newBlockStyles = []
    for i in [@map.length-1..0]
      for j in [0...@map[i].length]
        unless newMap.hasOwnProperty(j)
          newMap[j] = []
          newBlockStyles[j] = []
        newMap[j].push @map[i][j]
        newBlockStyles[j].push @blockStyles[i][j]
    @map = newMap
    @blockStyles = newBlockStyles

  getMap: -> @map
  getBlockStyles: -> @blockStyles

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
        continue unless map[y][i]

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

    buildBlockBuildable = @level.isBuildBlockBuildable()

    map = @getMap()
    blockStyles = @getBlockStyles()
    for row, y in map
      for segment, x in row
        continue if segment is 0

        spriteIndex = blockStyles[y][x]
        sprite = @blockSprites[@style][spriteIndex]

        if not buildBlockBuildable and @buildMode
          sprite = @blockSprites[@style].unbuildable

        rx = position.x + x * @level.GRID_SIZE
        ry = position.y + y * @level.GRID_SIZE + segment.getOffset().getY()

        continue if rx > @app.getWidth() or
          rx + sprite.getWidth() < 0

        if @buildMode
          context.globalAlpha = 0.5

        sprite.draw context,
          rx, ry

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