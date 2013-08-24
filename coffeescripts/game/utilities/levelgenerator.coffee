Platform = require "../entities/platform.coffee"

class LevelGenerator
  constructor: (@app, @game, @level) ->
    return

  ###
    1 long platform per 5 screens
    1 short platform per 5 screens
    1 big obstacle per 5 screens (what exactly? a gear? a saw?)
    1 small obstacle per 5 screens
  ###
  generate: (screenOffset=1, screens=10) ->
    screenTilesX = Math.round(@app.getWidth()  / @level.GRID_SIZE)
    screenTilesY = Math.round(@app.getHeight() / @level.GRID_SIZE)

    longPlatformMaxWidth = screenTilesX
    longPlatformMinWidth = Math.round(screenTilesX / 2)

    for i in [screenOffset...screenOffset + Math.floor(screens / 5)]
      screenAreaWidth = screenTilesX * 5
      screenOffsetX = screenTilesX * i

      platformWidth = Math.round(
        longPlatformMinWidth +
        Math.random() * (longPlatformMaxWidth - longPlatformMinWidth)
      )

      platformX = screenOffsetX + Math.round(Math.random() * (screenAreaWidth - platformWidth))
      platformY = Math.round(screenTilesY / 2 + Math.random() * (screenTilesY / 2))

      platform = new Platform @app, @game,
        position: new LDFW.Vector2(platformX, platformY)
        width: platformWidth
        height: screenTilesY - platformY

      @level.addPlatform platform

module.exports = LevelGenerator
