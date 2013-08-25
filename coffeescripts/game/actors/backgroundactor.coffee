class BackgroundActor extends LDFW.Actor
  constructor: (@app) ->
    super @app

    @spritesAtlas = @app.getSpritesAtlas()
    @backgroundSprite = @spritesAtlas.createSprite "background.png"

  update: (delta) ->
    return

  draw: (context) ->
    @backgroundSprite.draw context

module.exports = BackgroundActor
