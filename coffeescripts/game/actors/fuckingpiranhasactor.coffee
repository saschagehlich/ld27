Config = require "../config/config.json"

class FuckingPiranhasActor extends LDFW.Actor
  constructor: (@app, @game, @options={}) ->
    @position = @options.position || new LDFW.Vector2(0, 0)
    @width = 6
    @height = 6

    @waterTop = 54

    @spritesAtlas = @app.getSpritesAtlas()

    @backgroundSprite = @spritesAtlas.createSprite "obstacles/fucking-piranhas/fucking-piranhas-background.png"
    @glassSprite = @spritesAtlas.createSprite "obstacles/fucking-piranhas/fucking-piranhas-glass.png"

    @ploppSprite = @spritesAtlas.createSprite "obstacles/fucking-piranhas/fucking-piranhas-plopp.png"

    @bubbles = []
    for i in [0...50]
      bubbleSprite = @spritesAtlas.createSprite "obstacles/fucking-piranhas/fucking-piranhas-bubble.png"
      @randomizePosition bubbleSprite
      bubbleSprite.ploppedAt = null
      @bubbles.push bubbleSprite

  randomizePosition: (bubbleSprite) ->
    bubbleSprite.setPosition(
      Math.random() * (@backgroundSprite.getWidth() - bubbleSprite.getWidth()),
      @waterTop + Math.random() * (@backgroundSprite.getHeight() - @waterTop)
    )

  update: (delta) ->
    for bubble in @bubbles
      pos = bubble.getPosition()
      curY = pos.getY()
      newY = curY - 40 * delta
      pos.setY newY

      if pos.getY() <= @waterTop and not bubble.ploppedAt
        bubble.ploppedAt = Date.now()
      else if bubble.ploppedAt and Date.now() - bubble.ploppedAt > 500
        @randomizePosition bubble
        bubble.ploppedAt = null


  draw: (context, x, y) ->
    @backgroundSprite.draw context, x, y
    @glassSprite.draw context, x, y

    for bubble in @bubbles
      pos = bubble.getPosition()

      if pos.getY() > @waterTop
        bubble.draw context, x + pos.getX(), y + pos.getY()
      else
        @ploppSprite.draw context, x + pos.getX(), y + @waterTop - @ploppSprite.getHeight()

  getWidth: -> @width
  getHeight: -> @height

module.exports = FuckingPiranhasActor
