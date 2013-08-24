GameStage = require "../stages/gamestage.coffee"
Game      = require "../game.coffee"

class GameScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app
    @game = new Game @game

    @gameStage = new GameStage @app, @game

  update: (delta) ->
    @game.update delta
    @gameStage.update delta
    return

  draw: (context) ->
    @gameStage.draw context
    return

module.exports = GameScreen
