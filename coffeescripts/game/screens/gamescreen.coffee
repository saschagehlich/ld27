GameStage = require "../stages/gamestage.coffee"
UIStage   = require "../stages/uistage.coffee"
Game      = require "../game.coffee"

class GameScreen extends LDFW.Screen
  constructor: (@app) ->
    super @app
    @game = new Game @app

    @uiStage   = new UIStage @app, @game
    @gameStage = new GameStage @app, @game

  update: (delta) ->
    @game.update delta
    @gameStage.update delta
    @uiStage.update delta
    return

  draw: (context) ->
    @gameStage.draw context
    @uiStage.draw context
    return

module.exports = GameScreen
