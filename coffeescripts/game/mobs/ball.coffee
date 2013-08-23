class Ball extends LDFW.Actor
  constructor: ->
    super

    @spritesAtlas = @game.getSpritesAtlas()
    @sprite = @spritesAtlas.createSprite "ball.png"

    @speedX = 4
    @speedY = 4

    @sprite.setOrigin @sprite.getWidth() / 2, @sprite.getHeight() / 2

  update: (delta) ->
    @setPosition(
      @getX() + @speedX,
      @getY() + @speedY
    )
    @sprite.setPosition @getPosition()
    @sprite.setRotation @sprite.getRotation() + 45 * delta

    gameWidth = @game.getWidth()
    gameHeight = @game.getHeight()
    if @getX() >= gameWidth - @sprite.getWidth() + @sprite.getOriginX() or
      @getX() <= @sprite.getOriginX()
        @speedX *= -1

    if @getY() >= gameHeight - @sprite.getHeight() or
      @getY() <= 0
        @speedY *= -1

  draw: (context) ->
    @sprite.draw context

module.exports = Ball
