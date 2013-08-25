Config = require "../config/config.json"
Powerups = require "../powerups.coffee"

class LevelActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @spritesAtlas = @app.getSpritesAtlas()
    @backgroundSprite = @spritesAtlas.createSprite "background.png"

    @prepareSprites()

    @level = @game.getLevel()

  prepareSprites: ->
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

  update: (delta) ->
    obstacles = @level.getObstacles()
    for obstacle in obstacles
      obstacle.update delta

  draw: (context) ->
    context.save()

    @backgroundSprite.draw context

    @drawPlatforms  context
    @drawBlocks     context
    @drawBuildBlock context
    @drawObstacles  context

    context.restore()

  drawObstacles: (context) ->
    obstacles = @level.getObstacles()
    scroll    = @level.getScroll()
    for obstacle in obstacles
      position = obstacle.getPosition()
        .clone()
        .multiply(@level.GRID_SIZE)

      obstacle.draw context,
        position.x - scroll.getX(),
        position.y - scroll.getY()

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
            position.x + x * @level.GRID_SIZE - scroll.getX(),
            position.y + y * @level.GRID_SIZE - scroll.getY()

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
          position.x + x * @level.GRID_SIZE + grassXOffset - scroll.getX(),
          position.y - scroll.getY()

  drawBuildBlock: (context) ->
    return unless @level.inBuildMode()

    @level.getBuildBlock().draw context

  drawBlocks: (context) ->
    blocks   = @level.getBlocks()
    for block in blocks
      block.draw context

module.exports = LevelActor
