class GameScreen extends LDFW.Screen
  constructor: (@game) ->
    @spriteAtlas = @game.getSpritesAtlas()

    @exampleSprite = @spriteAtlas.createSprite("example.png")
    super

  update: (delta) ->
    return

  draw: (context) ->
    @exampleSprite.draw context
    return

module.exports = GameScreen
