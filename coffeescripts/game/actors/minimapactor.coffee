FuckingPiranhasActor = require "./fuckingpiranhasactor.coffee"

class MinimapActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @level = @game.getLevel()

    @spritesAtlas = @app.getSpritesAtlas()
    @piranhasSprite = @spritesAtlas.createSprite "ui/minimap-fucking-piranhas.png"

    @background = @spritesAtlas.createSprite "ui/minimap.png"
    @background.setPosition 0, @app.getHeight() - @background.getHeight()

  update: (delta) -> return

  draw: (context) ->
    @background.draw context
    @drawMinimapContents context

  drawMinimapContents: (context) ->
    platforms = @level.getPlatforms()
    blocks    = @level.getBlocks()
    obstacles = @level.getObstacles()
    player    = @game.getPlayer()

    drawPadding = new LDFW.Vector2(8, 8)
    drawOptions =
      offset:  @background.getPosition().clone().floor()
      padding: drawPadding
      height:  @background.getHeight() - drawPadding.getY() * 2

    scale = drawOptions.height / @app.getHeight()
    drawOptions.scaledGridSize = @level.GRID_SIZE * scale
    drawOptions.scale = scale

    scroll    = @game.getScroll()
      .clone()
      .multiply(scale)
      .substract(@app.getWidth() / 2, 0)

    @drawPlayer context, player, scroll, drawOptions
    @drawPlatforms context, platforms, scroll, drawOptions
    @drawObstacles context, obstacles, scroll, drawOptions
    @drawBlocks context, blocks, scroll, drawOptions

  drawPlayer: (context, player, scroll, options) ->
    context.save()
    context.fillStyle = "#af2f2f"

    position = player.getPosition()
      .clone()
      .multiply(options.scale)

    context.fillRect(
      Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX()),
      Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 2),
      options.scaledGridSize * 3,
      options.scaledGridSize
    )

    context.fillRect(
      Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX() + options.scaledGridSize),
      Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 3),
      options.scaledGridSize,
      options.scaledGridSize * 3
    )

    context.restore()

  drawBlocks: (context, blocks, scroll, options) ->
    for block in blocks
      position = block.getGridPosition()
        .clone()
        .multiply(options.scaledGridSize)
      map      = block.getMap()

      for row, y in map
        for segment, x in row
          continue if segment is 0

          scaledX = x * options.scaledGridSize
          scaledY = y * options.scaledGridSize

          context.fillRect(
            Math.floor(options.offset.getX() + options.padding.getX() + position.getX() + scaledX - scroll.getX()),
            Math.floor(options.offset.getY() + options.padding.getY() + position.getY() + scaledY),
            options.scaledGridSize,
            options.scaledGridSize
          )

  drawObstacles: (context, obstacles, scroll, options) ->
    context.save()
    context.fillStyle = "#af2f2f"

    for obstacle in obstacles
      position = obstacle.getPosition()
        .clone()
        .multiply(options.scaledGridSize)
      width = obstacle.getWidth() * options.scaledGridSize
      height = obstacle.getHeight() * options.scaledGridSize

      context.fillRect(
        Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX()),
        Math.floor(options.offset.getY() + options.padding.getY() + position.getY()),
        width,
        height
      )

      if obstacle instanceof FuckingPiranhasActor
        @piranhasSprite.draw context,
          Math.floor(options.offset.getX() + options.padding.getX() +
            position.getX() - scroll.getX() +
            + width / 2 - @piranhasSprite.getWidth() / 2),
          Math.floor(options.offset.getY() + options.padding.getY() +
            position.getY() +
            + height / 2 - @piranhasSprite.getHeight() / 2)

    context.restore()



  drawPlatforms: (context, platforms, scroll, options) ->
    for platform in platforms
      position = platform.getPosition()
        .clone()
        .multiply(options.scaledGridSize)

      width    = platform.getWidth()
      height   = platform.getHeight()

      context.fillStyle = "white"

      context.fillRect(
        options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX(),
        options.offset.getY() + options.padding.getY() + position.getY(),
        width * options.scaledGridSize,
        height * options.scaledGridSize
      )


module.exports = MinimapActor
