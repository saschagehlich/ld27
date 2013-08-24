PlayerActor = require "../actors/playeractor.coffee"
LevelActor  = require "../actors/levelactor.coffee"

class GameStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @levelActor  = new LevelActor  @app, @game
    @addActor @levelActor

    @playerActor = new PlayerActor @app, @game
    @addActor @playerActor

module.exports = GameStage
