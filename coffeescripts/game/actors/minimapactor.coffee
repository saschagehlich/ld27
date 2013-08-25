FuckingPiranhasActor = require "./fuckingpiranhasactor.coffee"

class MinimapActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @level = @game.getLevel()

    @spritesAtlas = @app.getSpritesAtlas()
    @piranhasSprite = @spritesAtlas.createSprite "ui/minimap-fucking-piranhas.png"

    @background = @spritesAtlas.createSprite "ui/minimap.png"
    @background.setPosition 0, @app.getHeight() - @background.getHeight()

    @fontsAtlas = @app.getFontsAtlas()
    @font = new LDFW.BitmapFont(
      @app.getPreloader().get("assets/fonts/pixel-8-white.fnt"),
      @fontsAtlas.findRegion("pixel-8-white.png")
    )

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
      width:   @background.getWidth() - drawPadding.getX() * 2

    scale = drawOptions.height / @app.getHeight()
    drawOptions.scaledGridSize = Math.round(@level.GRID_SIZE * scale)
    drawOptions.scale = scale

    scroll    = @game.getScroll()
      .clone()
      .multiply(scale)
      .substract(@app.getWidth() / 2, 0)

    if scroll.getX() * scale < drawOptions.width / 2
      @drawStartIndicator context, scroll, drawOptions

    @drawPlayer context, player, scroll, drawOptions
    @drawPlatforms context, platforms, scroll, drawOptions
    @drawObstacles context, obstacles, scroll, drawOptions
    @drawBlocks context, blocks, scroll, drawOptions

  drawStartIndicator: (context, scroll, options) ->
    context.save()
    context.globalAlpha = 0.03
    context.fillStyle = "rgba(255, 255, 255)"

    context.fillRect(
      - scroll.getX(), options.offset.getY() + options.padding.getY(),
      2, options.height
    )

    context.globalAlpha = 0.1

    startText = "START >"
    startBounds = @font.getBounds startText
    @font.drawText context,
      startText,
      - scroll.getX() - startBounds.width - 8,
      options.offset.getY() + options.padding.getY() + options.height / 2 - startBounds.getHeight() / 2

    context.restore()

  drawPlayer: (context, player, scroll, options) ->
    context.save()
    context.fillStyle = "#af2f2f"

    position = player.getPosition()
      .clone()
      .multiply(options.scale)

    roy = options.offset.getY() + options.padding.getY()
    rmy = options.offset.getY() + options.padding.getY() + options.width

    rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX())
    ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 2)
    rw = options.scaledGridSize * 3
    rh = options.scaledGridSize

    if ry < roy
      rh -= roy - ry
      ry = roy
    if ry + rh < roy
      rh = 0
    if ry + rh > rmy
      rh -= (ry + rh) - rmy

    context.fillRect(
      rx, ry,
      rw, rh
    )

    rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX() + options.scaledGridSize)
    ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() - options.scaledGridSize * 3)
    rw = options.scaledGridSize
    rh = options.scaledGridSize * 3

    if ry < roy
      rh += ry - roy
      ry = roy
    if ry + rh > rmy
      rh -= (ry + rh) - rmy

    context.fillRect(
      rx, ry,
      rw, rh
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

          rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() + scaledX - scroll.getX())
          ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY() + scaledY)
          rw = options.scaledGridSize
          rh = options.scaledGridSize

          # Render limitation
          rox = options.offset.getX() + options.padding.getX()
          rmx = options.offset.getX() + options.padding.getX() + options.width
          continue if rx + rw < rox or rx > rmx

          if rx < rox
            rw += rx - rox
            rx = rox

          context.fillRect(
            rx, ry,
            rw, rh
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

      rx = Math.floor(options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX())
      ry = Math.floor(options.offset.getY() + options.padding.getY() + position.getY())
      rw = width
      rh = height

      # Render limitation
      rox = options.offset.getX() + options.padding.getX()
      rmx = options.offset.getX() + options.padding.getX() + options.width
      continue if rx + rw < rox or rx > rmx

      if rx < rox
        rw += rx - rox
        rx = rox
      if rx + rw > rmx
        rw -= (rx + rw) - rmx

      context.fillRect(
        rx, ry,
        rw, rh
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

      rx = options.offset.getX() + options.padding.getX() + position.getX() - scroll.getX()
      ry = options.offset.getY() + options.padding.getY() + position.getY()
      rw = width * options.scaledGridSize
      rh = height * options.scaledGridSize

      # Render limitation
      rox = options.offset.getX() + options.padding.getX()
      rmx = options.offset.getX() + options.padding.getX() + options.width
      continue if rx + rw < rox or rx > rmx

      if rx < rox
        rw += rx - rox
        rx = rox
      if rx + rw > rmx
        rw -= (rx + rw) - rmx

      context.fillRect(
        rx + options.scaledGridSize, ry,
        rw - options.scaledGridSize * 2, options.scaledGridSize
      )

      context.fillRect(
        rx, ry + options.scaledGridSize,
        rw, rh - options.scaledGridSize
      )


module.exports = MinimapActor
