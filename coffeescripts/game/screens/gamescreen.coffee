ExampleStage = require "../stages/examplestage.coffee"

class GameScreen extends LDFW.Screen
  constructor: (@game) ->
    @spriteAtlas = @game.getSpritesAtlas()
    @exampleStage = new ExampleStage @game
    super

  update: (delta) ->
    @exampleStage.update delta

  draw: (context) ->
    @exampleStage.draw context
    return

module.exports = GameScreen
