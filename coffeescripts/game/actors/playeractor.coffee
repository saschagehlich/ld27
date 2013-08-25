PLAYER_WIDTH = 32
PLAYER_HEIGHT = 64

class PlayerActor extends LDFW.Actor
  constructor: (@app, game) ->
    super @game

    @game  = game
    @level = @game.getLevel()
    @player = @game.getPlayer()

  update: (delta) ->
    return

  draw: (context) ->
    playerPosition = @player.getPosition()
    scroll = @level.getScroll()

    context.save()

    context.fillStyle = "green"
    context.fillRect(
      playerPosition.x - scroll.getX(), playerPosition.y - PLAYER_HEIGHT - scroll.getY(),
      PLAYER_WIDTH, PLAYER_HEIGHT
    )

    context.restore()

module.exports = PlayerActor
