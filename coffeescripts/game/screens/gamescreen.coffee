ExampleActor = require "../actors/exampleactor.coffee"

class GameScreen extends LDFW.Screen
  constructor: (@game) ->
    @spriteAtlas = @game.getSpritesAtlas()
    @exampleActor = new ExampleActor @game
    super

  update: (delta) ->
    @exampleActor.update delta

  draw: (context) ->
    @exampleActor.draw context
    return

module.exports = GameScreen
