class Player extends LDFW.Actor
  constructor: ->
    super

    @spritesAtlas = @game.getSpritesAtlas()
    @sprite       = @spritesAtlas.createSprite "player.png"

    @setSize @sprite.getWidth(), @sprite.getHeight()

  update: (delta) ->
    @sprite.setPosition @getPosition()

  draw: (context) ->
    @sprite.draw context

module.exports = Player
