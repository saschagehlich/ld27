Config = require "../config/config.json"

class LevelActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @spritesAtlas = @app.getSpritesAtlas()
    @backgroundSprite = @spritesAtlas.createSprite "background.png"

    @prepareSprites()

    @level = @game.getLevel()

  prepareSprites: ->
    @blockSprites = {}
    for style in [0...Config.block_styles]
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

    @tileSprites = {}
    for spriteIndex in [0...Config.sprites_per_block_style]
      sprite = @spritesAtlas.createSprite "platform/platform-#{spriteIndex}.png"

      @tileSprites[spriteIndex] = sprite

    @tileSprites["start"] = @spritesAtlas.createSprite "platform/platform-start.png"
    @tileSprites["end"] = @spritesAtlas.createSprite "platform/platform-end.png"

  draw: (context) ->
    context.save()

    @backgroundSprite.draw context

    @drawPlatforms  context
    @drawBlocks     context
    @drawBuildBlock context

    context.restore()

  drawPlatforms: (context) ->
    platforms = @level.getPlatforms()
    scroll    = @level.getScroll()

    for platform in platforms

      stylesMap = platform.getStylesMap()
      position = platform.getPosition()
        .clone()
        .multiply(@level.GRID_SIZE)
      width = platform.getWidth() * @level.GRID_SIZE
      height = platform.getHeight() * @level.GRID_SIZE

      # Draw tiles
      for y in [0...platform.getHeight()]
        for x in [0...platform.getWidth()]
          spriteIndex = stylesMap[y][x]
          tileSprite = @tileSprites[spriteIndex]
          if x is 0
            tileSprite = @tileSprites.start
          if x is platform.getWidth() - 1
            tileSprite = @tileSprites.end

          tileSprite.draw context,
            position.x + x * @level.GRID_SIZE,
            position.y + y * @level.GRID_SIZE

      # Draw grass
      for x in [0...platform.width]
        grassSprite = @grassSprites[0]
        grassXOffset = 0
        if platform.width is 1
          grassSprite = @grassSprites.single
          grassXOffset = -2
        else if x is 0
          grassSprite = @grassSprites.start
          grassXOffset = -2
        else if x is platform.width - 1
          grassSprite = @grassSprites.end

        grassSprite.draw context,
          position.x + x * @level.GRID_SIZE + grassXOffset,
          position.y

  drawBuildBlock: (context) ->
    return unless @level.inBuildMode()

    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    @drawBlock @level.getBuildBlock(), context, true

  drawBlocks: (context) ->
    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    for block in blocks
      @drawBlock block, context

  drawBlock: (block, context, isBuildBlock=false) ->
    scroll   = @level.getScroll()
    map      = block.getMap()
    style    = block.getStyle()
    blockStyles = block.getBlockStyles()

    position = block
      .getGridPosition()
      .clone()
      .multiply(@level.GRID_SIZE)
      .substract(scroll)

    for row, y in map
      for segment, x in row
        continue if segment is 0

        spriteIndex = blockStyles[y][x]
        sprite = @blockSprites[style][spriteIndex]

        if not @level.isBuildBlockBuildable() and isBuildBlock
          sprite = @blockSprites[style].unbuildable

        sprite.draw context,
          position.x + x * @level.GRID_SIZE,
          position.y + y * @level.GRID_SIZE

        drawGrass = true
        unless y is 0
          if map[y - 1][x] is 1
            drawGrass = false

        if drawGrass
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
            position.y + y * @level.GRID_SIZE

module.exports = LevelActor
