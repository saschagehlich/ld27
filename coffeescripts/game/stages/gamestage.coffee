Ball   = require "../mobs/ball.coffee"
Player = require "../mobs/player.coffee"

class GameStage extends LDFW.Stage
  constructor: ->
    super

    @ball = new Ball @game
    @ball.setPosition @game.getWidth() / 2, @game.getHeight() / 2
    @addActor @ball

    @players = []

    distanceToBoundaries = 30

    player = new Player @game
    player.setPosition(
      distanceToBoundaries,
      @game.getHeight() / 2 - player.getHeight() / 2
    )
    @players.push player
    @addActor player

    player = new Player @game
    player.setPosition(
      @game.getWidth() - player.getWidth() - distanceToBoundaries,
      @game.getHeight() / 2 - player.getHeight() / 2
    )
    @players.push player
    @addActor player

module.exports = GameStage
