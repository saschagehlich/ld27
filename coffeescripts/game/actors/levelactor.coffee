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
      @blockSprites[style] ?= []
      for spriteIndex in [0...Config.sprites_per_block_style]
        sprite = @spritesAtlas.createSprite "blocks/#{style}-#{spriteIndex}.png"

        @blockSprites[style].push sprite

    @grassSprites = {}
    for spriteIndex in [0...Config.sprites_per_block_style]
      sprite = @spritesAtlas.createSprite "grass/grass-#{spriteIndex}.png"

      @grassSprites[spriteIndex] = sprite

    @grassSprites["start"] = @spritesAtlas.createSprite "grass/grass-start.png"
    @grassSprites["end"] = @spritesAtlas.createSprite "grass/grass-end.png"
    @grassSprites["single"] = @spritesAtlas.createSprite "grass/grass-single.png"

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
      context.fillStyle = "red"
      context.fillRect(
        platform.position.x - @level.getScroll().x,
        platform.position.y - @level.getScroll().y,
        platform.width, platform.height
      )

  drawBuildBlock: (context) ->
    return unless @level.inBuildMode()

    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    @drawBlock @level.getBuildBlock(), context

  drawBlocks: (context) ->
    scroll   = @level.getScroll()
    blocks   = @level.getBlocks()
    for block in blocks
      @drawBlock block, context

  drawBlock: (block, context) ->
    scroll   = @level.getScroll()
    map      = block.getMap()
    style    = block.getStyle()
    position = block
      .getGridPosition()
      .clone()
      .multiply(@level.GRID_SIZE)
      .substract(scroll)

    for row, y in map
      for segment, x in row
        continue if segment is 0

        spriteIndex = 0
        sprite = @blockSprites[style][spriteIndex]

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
