class MinimapActor extends LDFW.Actor
  constructor: (@app, @game) ->
    super @game

    @spritesAtlas = @app.getSpritesAtlas()

    @background = @spritesAtlas.createSprite "ui/minimap.png"
    @background.setPosition 0, @app.getHeight() - @background.getHeight()

  update: (delta) -> return
  draw: (context) ->
    @background.draw context

module.exports = MinimapActor
