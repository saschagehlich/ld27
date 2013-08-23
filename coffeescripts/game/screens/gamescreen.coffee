GameStage = require "../stages/gamestage.coffee"

class GameScreen extends LDFW.Screen
  constructor: (@game) ->
    @spriteAtlas = @game.getSpritesAtlas()
    @gameStage = new GameStage @game
    super

  update: (delta) ->
    @gameStage.update delta

  draw: (context) ->
    @gameStage.draw context
    return

module.exports = GameScreen
