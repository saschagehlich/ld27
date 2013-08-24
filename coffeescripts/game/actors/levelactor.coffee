PLATFORM_HEIGHT = 16

class LevelActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game
    @level = @game.getLevel()

  draw: (context) ->
    platforms = @level.getPlatforms()
    scroll    = @level.getScroll()

    for platform in platforms
      context.save()
      context.fillStyle = "red"

      context.fillRect(
        platform.position.x - @level.getScroll().x,
        platform.position.y - @level.getScroll().y,
        platform.width, PLATFORM_HEIGHT
      )

      context.restore()

module.exports = LevelActor
