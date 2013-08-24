PlayerActor = require "../actors/playeractor.coffee"
LevelActor  = require "../actors/levelactor.coffee"

class GameStage extends LDFW.Stage
  constructor: (@app, @game) ->
    super @game

    @playerActor = new PlayerActor @app, @game
    @addActor @playerActor

    @levelActor  = new LevelActor  @app, @game
    @addActor @levelActor

module.exports = GameStage
