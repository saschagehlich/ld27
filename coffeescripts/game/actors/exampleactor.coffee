class ExampleActor extends LDFW.Actor
  constructor: ->
    super

    @spritesAtlas = @game.getSpritesAtlas()
    @sprite = @spritesAtlas.createSprite "example.png"

  update: (delta) ->
    @sprite.setPosition(
      @sprite.getX() + 10 * delta,
      @sprite.getY() + 10 * delta
    )

  draw: (context) ->
    @sprite.draw context

module.exports = ExampleActor
