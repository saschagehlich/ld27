Config = require "../config/config.json"

class FuckingPiranhasActor extends LDFW.Actor
  constructor: (@app, @game, @options={}) ->
    @position = @options.position || new LDFW.Vector2(0, 0)
    @width = 6
    @height = 6

    @spritesAtlas = @app.getSpritesAtlas()

    @backgroundSprite = @spritesAtlas.createSprite "obstacles/fucking-piranhas/fucking-piranhas-background.png"

  update: ->
    return

  draw: (context, x, y) ->
    @backgroundSprite.draw context, x, y
    return

  getWidth: -> @width
  getHeight: -> @height

module.exports = FuckingPiranhasActor
