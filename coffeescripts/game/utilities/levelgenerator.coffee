Platform = require "../entities/platform.coffee"
FuckingPiranhas = require "../actors/fuckingpiranhasactor.coffee"

class LevelGenerator
  constructor: (@app, @game, @level) ->
    screenTilesX = Math.round(@app.getWidth()  / @level.GRID_SIZE)
    screenTilesY = Math.round(@app.getHeight() / @level.GRID_SIZE)

    @xOffset = screenTilesX

  generate: (screens=10) ->
    screenTilesX = Math.round(@app.getWidth()  / @level.GRID_SIZE)
    screenTilesY = Math.round(@app.getHeight() / @level.GRID_SIZE)

    newMaxOffset = @xOffset + screenTilesX * screens
    minGapSize   = screenTilesX / 2
    maxGapSize   = screenTilesX*2

    while @xOffset < newMaxOffset
      placedWidth = 0
      gapSize = minGapSize + Math.round(Math.random() * (maxGapSize - minGapSize))
      @xOffset += gapSize

      switch Math.floor(Math.random() * 2)
        when 0
          obstacle = new FuckingPiranhas @app, @game,
            position: new LDFW.Vector2(@xOffset, screenTilesY - 6)
          @level.addObstacle obstacle

          placedWidth = 6
        when 1
          # Place a platform
          minPlatformWidth = 4
          maxPlatformWidth = 13
          placedWidth = minPlatformWidth + Math.round(Math.random() * (maxPlatformWidth - minPlatformWidth))
          platform = new Platform @app, @game,
            position: new LDFW.Vector2(@xOffset, 10)
            width: placedWidth
            height: screenTilesY - 10

          @level.addPlatform platform

          placedWidth = 10

    @xOffset += placedWidth

module.exports = LevelGenerator
